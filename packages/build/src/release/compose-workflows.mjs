/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from '../platforms/resolve-platforms.mjs';
import { shapeOf } from '../platforms/server/app-shape.mjs';
import { SERVER_DEFAULT_ARCHES } from '../platforms/server/server.constants.mjs';
import { noWorkflowSteps } from './collect-workflow-steps.mjs';
import { fillTemplate } from './fill-template.mjs';
import { jobPermissionsBlock, mergePermissions, withJobPermissions } from './lift-permissions.mjs';
import { PUBLISH_JOB } from './publish-packages.constants.mjs';
import { publishJobText } from './publish-packages.mjs';
import { stepsAfter, stepsForJob } from './render-workflow-step.mjs';
import { REVIEW_NOTE, REVIEW_RUNNER, WINDOWLESS_NOTE } from './review-job.constants.mjs';
import { reviewJobValues } from './review-job-values.mjs';
import { setupSteps } from './setup-steps.mjs';
import { testEnvSteps, userNamespaceStep } from './test-env-steps.mjs';
import { REVIEW_USERNS_STEP_NAME } from './review-job.constants.mjs';
import { DEFAULT_BRANCH, RELEASE_DIR, SET_VERSION } from './workflows.constants.mjs';

/**
 * @typedef {import('../platforms/platform.type.mjs').Job} Job
 * @typedef {import('../platforms/platform.type.mjs').JobContext} JobContext
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
 * @typedef {import('./collect-workflow-steps.mjs').CollectedSteps} CollectedSteps
 * @typedef {{ name: string, tagPrefix: string, notesDir: string }} AppOfMany
 * @typedef {import('./publish-packages.mjs').PublishPlan} PublishPlan
 * @typedef {import('./test-env-steps.mjs').TestEnv} TestEnv
 */

const NO_TEST_ENV = Object.freeze({ linuxPackages: [], userNamespaces: false });

const DEFAULT_SERVER = Object.freeze({ id: 'app', arch: SERVER_DEFAULT_ARCHES, image: null });

const JOB_HEAD = /^ {2}([a-z][\w-]*):\n/gm;
const GATE = "    needs: changes\n    if: needs.changes.outputs.changed == 'true'\n";

const jobBlock = (job) => `\n${job.text.trimEnd()}\n`;

const previewWords = (download) => (download.preview ? ` "${download.preview.glob}" "${download.preview.label}"` : '');

const downloadLine = (download) => (download.latest
  ? `            stub "${download.glob}" "${download.label}"${previewWords(download)}`
  : `            link "${download.glob}" "${download.label}"`);

const gated = (text) => text.replace(JOB_HEAD, (head) => `${head}${GATE}`);

const rootSteps = () => fillTemplate(RELEASE_DIR, 'ci-root-steps.yml.tmpl', {}).trimEnd();

/**
 * @param {{ appDir: string, prefix: string, systemSteps: ModuleCiStep[], steps: CollectedSteps, server: JobContext['server'] }} input
 * @param {'ci' | 'release'} workflow
 * @returns {JobContext} the setup and the step points of one workflow's jobs
 */
const jobContext = ({ appDir, prefix, systemSteps, steps, server }, workflow) => {
  const lifted = new Map();
  const runHere = (list, where) => {
    const chosen = stepsForJob(list, where);
    if (where.job) lifted.set(where.job, mergePermissions(lifted.get(where.job) ?? {}, ...chosen.map((step) => step.permissions)));
    return chosen;
  };
  return {
    appDir,
    prefix,
    server,
    liftedPermissions: (job) => lifted.get(job),
    setup: (os, opts = {}) => setupSteps({
      os, release: opts.release, history: opts.history, systemSteps,
      appSteps: runHere(steps[workflow].beforeInstall, { os, platform: opts.platform, job: opts.job }),
    }),
    stepsAt: (point, os, platform = null, job = null) => stepsAfter(runHere(steps[workflow][point] ?? [], { os, platform, job })),
  };
};

/**
 * @param {{ jobs: Job[], postJobs: Job[] }} jobs the jobs before the release and after it
 * @param {{ appDir: string, app: AppOfMany | null, branch: string, ctx: JobContext, publish: PublishPlan | null }} where
 */
const releaseText = ({ jobs, postJobs }, { appDir, app, branch, ctx, publish }) => {
  const builds = `[${['prepare', ...jobs.map((job) => job.id)].join(', ')}]`;
  const prepareSteps = ctx.stepsAt('beforeInstall', 'linux', null, 'prepare');
  const prepareAfterInstall = ctx.stepsAt('prepare', 'linux', null, 'prepare');
  return fillTemplate(RELEASE_DIR, 'release-workflow.yml.tmpl', {
    TITLE: app ? ` ${app.name}` : '',
    GROUP: app ? `-${app.name}` : '',
    APP_FLAG: app ? ` --app ${app.name}` : '',
    TAG_PREFIX: app?.tagPrefix ?? 'v',
    NOTES_DIR: app?.notesDir ?? 'release-notes',
    APP_DIR: appDir,
    BRANCH: branch,
    PREPARE_PERMISSIONS: jobPermissionsBlock(ctx.liftedPermissions('prepare')),
    PREPARE_STEPS: prepareSteps,
    PREPARE_AFTER_INSTALL: prepareAfterInstall,
    SET_VERSION,
    JOBS: jobs.map(jobBlock).join('').replace(/^\n/, ''),
    POST_JOBS: postJobs.map(jobBlock).join(''),
    PUBLISH_JOB: publishJobText(publish, builds),
    NEEDS: builds,
    DOWNLOADS: jobs.flatMap((job) => job.downloads ?? []).map(downloadLine).join('\n') || '            echo "No platform builds a download."',
  });
};

/**
 * @param {JobContext} ctx
 * @param {string} key the template key prefix
 * @param {string} job the job id
 * @returns {Record<string, string>} the setup and the build step points of one CI job
 */
const jobSteps = (ctx, key, job) => ({
  [`${key}_SETUP`]: ctx.setup('linux', { job }),
  [`${key}_BEFORE_BUILD`]: ctx.stepsAt('beforeBuild', 'linux', null, job),
  [`${key}_AFTER_BUILD`]: ctx.stepsAt('afterBuild', 'linux', null, job),
});

/**
 * @param {JobContext} ctx
 * @param {{ app: AppOfMany | null, review: Record<string, string> }} where
 * @returns {string} the review job
 */
const reviewJob = (ctx, { app, review }) => fillTemplate(RELEASE_DIR, 'ci-review-job.yml.tmpl', {
  ARTIFACT: app ? `-${app.name}` : '', REVIEW_RUNNER, USERNS_STEP: userNamespaceStep(REVIEW_USERNS_STEP_NAME), ...review, ...jobSteps(ctx, 'REVIEW', 'review'),
}).trimEnd();

/**
 * @param {Job[]} platformJobs
 * @param {{ appDir: string, app: AppOfMany | null, baselines: boolean, branch: string, ctx: JobContext, windowless: boolean, testEnv: TestEnv }} where
 */
const ciText = (platformJobs, { appDir, app, baselines, branch, ctx, windowless, testEnv }) => {
  const review = reviewJobValues({ baselines: baselines && !windowless, app });
  const appJobs = fillTemplate(RELEASE_DIR, 'ci-app-jobs.yml.tmpl', {
    ROOT_STEPS: app ? '' : rootSteps(),
    REVIEW_JOB: windowless ? '' : reviewJob(ctx, { app, review }),
    ...jobSteps(ctx, 'QUALITY', 'quality'),
    TEST_ENV: testEnvSteps(testEnv),
    BEFORE_TEST: ctx.stepsAt('beforeTest', 'linux', null, 'quality'),
  });
  const own = `${appJobs.trimEnd()}\n${platformJobs.map(jobBlock).join('')}`;
  const changes = app ? `${fillTemplate(RELEASE_DIR, 'ci-changes-job.yml.tmpl', { SETUP: ctx.setup('linux', { history: true, job: 'changes' }) }).trimEnd()}\n\n` : '';
  return fillTemplate(RELEASE_DIR, 'ci-workflow.yml.tmpl', {
    TITLE: app ? ` ${app.name}` : '',
    GROUP: app ? `-${app.name}` : '',
    APP_DIR: appDir,
    BRANCH: branch,
    JOBS: `${changes}${app ? gated(own) : own}`,
    DISPATCH_INPUTS: review.DISPATCH_INPUTS,
    REVIEW_NOTE: windowless ? WINDOWLESS_NOTE : REVIEW_NOTE,
  });
};

/**
 * @param {{ app: AppOfMany | null, windowless: boolean, publish: PublishPlan | null, ciJobs: Job[], releaseJobs: Job[], postJobs: Job[] }} parts
 * @returns {{ ci: string[], release: string[] }} the job ids of both workflows, in order
 */
const jobIdsOf = ({ app, windowless, publish, ciJobs, releaseJobs, postJobs }) => ({
  ci: [...(app ? ['changes'] : []), 'quality', ...(windowless ? [] : ['review']), ...ciJobs.map((job) => job.id)],
  release: ['prepare', ...releaseJobs.map((job) => job.id), ...(publish ? [PUBLISH_JOB] : []), 'release', ...postJobs.map((job) => job.id)],
});

/**
 * @param {{ targets: string[], appDir?: string, prefix: string, systemSteps?: ModuleCiStep[], steps?: CollectedSteps, app?: AppOfMany | null, baselines?: boolean, branch?: string, server?: JobContext['server'], publish?: PublishPlan | null, testEnv?: TestEnv }} input
 * @returns {{ ci: string, release: string, jobs: { ci: string[], release: string[] } }}
 */
const composeWorkflows = ({ targets, appDir = '.', prefix, systemSteps = [], steps = noWorkflowSteps(), app = null, baselines = false, branch = DEFAULT_BRANCH, server = DEFAULT_SERVER, publish = null, testEnv = NO_TEST_ENV }) => {
  const { platforms } = resolvePlatforms(targets);
  const ciCtx = jobContext({ appDir, prefix, systemSteps, steps, server }, 'ci');
  const releaseCtx = jobContext({ appDir, prefix, systemSteps, steps, server }, 'release');
  const { windowless } = shapeOf(targets);
  const ciJobs = platforms.flatMap((platform) => (platform.ciJob ? [platform.ciJob(ciCtx)] : []));
  const releaseJobs = platforms.flatMap((platform) => (platform.releaseJob ? [platform.releaseJob(releaseCtx)] : []))
    .map((job) => ({ ...job, text: withJobPermissions(job.text, releaseCtx.liftedPermissions(job.id)) }));
  const postJobs = platforms.flatMap((platform) => (platform.publishJob ? [platform.publishJob(releaseCtx)] : []));
  return {
    ci: `${ciText(ciJobs, { appDir, app, baselines, branch, ctx: ciCtx, windowless, testEnv }).trimEnd()}\n`,
    release: `${releaseText({ jobs: releaseJobs, postJobs }, { appDir, app, branch, ctx: releaseCtx, publish }).trimEnd()}\n`,
    jobs: jobIdsOf({ app, windowless, publish, ciJobs, releaseJobs, postJobs }),
  };
};

/**
 * @param {ModuleCiStep[]} systemSteps
 * @param {string} [branch] the default branch, where a push runs it
 * @param {CollectedSteps} [steps] the shared steps
 * @returns {string} the workspace ci.yml of a repo of apps
 */
const workspaceCi = (systemSteps = [], branch = DEFAULT_BRANCH, steps = noWorkflowSteps()) => {
  const ctx = jobContext({ appDir: '.', prefix: '', systemSteps, steps, server: DEFAULT_SERVER }, 'ci');
  return `${fillTemplate(RELEASE_DIR, 'ci-workspace-workflow.yml.tmpl', {
    SETUP: ctx.setup('linux', { job: 'workspace' }),
    BEFORE_TEST: ctx.stepsAt('beforeTest', 'linux', null, 'workspace'),
    ROOT_STEPS: rootSteps(),
    BRANCH: branch,
  }).trimEnd()}\n`;
};

export { composeWorkflows, workspaceCi };
