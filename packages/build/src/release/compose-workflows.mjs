/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from '../platforms/resolve-platforms.mjs';
import { noWorkflowSteps } from './collect-workflow-steps.mjs';
import { fillTemplate } from './fill-template.mjs';
import { stepsAfter, stepsForJob } from './render-workflow-step.mjs';
import { REVIEW_RUNNER } from './review-job.constants.mjs';
import { reviewJobValues } from './review-job-values.mjs';
import { setupSteps } from './setup-steps.mjs';
import { DEFAULT_BRANCH, RELEASE_DIR, SET_VERSION } from './workflows.constants.mjs';

/**
 * @typedef {import('../platforms/platform.type.mjs').Job} Job
 * @typedef {import('../platforms/platform.type.mjs').JobContext} JobContext
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
 * @typedef {import('./collect-workflow-steps.mjs').CollectedSteps} CollectedSteps
 * @typedef {{ name: string, tagPrefix: string, notesDir: string }} AppOfMany
 */

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
 * @param {{ appDir: string, prefix: string, systemSteps: ModuleCiStep[], steps: CollectedSteps }} input
 * @param {'ci' | 'release'} workflow
 * @returns {JobContext} the setup and the step points of one workflow's jobs
 */
const jobContext = ({ appDir, prefix, systemSteps, steps }, workflow) => ({
  appDir,
  prefix,
  setup: (os, opts = {}) => setupSteps({
    os, release: opts.release, history: opts.history, systemSteps,
    appSteps: stepsForJob(steps[workflow].beforeInstall, { os, platform: opts.platform, job: opts.job }),
  }),
  stepsAt: (point, os, platform = null, job = null) => stepsAfter(stepsForJob(steps[workflow][point] ?? [], { os, platform, job })),
});

/**
 * @param {Job[]} jobs
 * @param {{ appDir: string, app: AppOfMany | null, branch: string, ctx: JobContext }} where
 */
const releaseText = (jobs, { appDir, app, branch, ctx }) => fillTemplate(RELEASE_DIR, 'release-workflow.yml.tmpl', {
  TITLE: app ? ` ${app.name}` : '',
  GROUP: app ? `-${app.name}` : '',
  APP_FLAG: app ? ` --app ${app.name}` : '',
  TAG_PREFIX: app?.tagPrefix ?? 'v',
  NOTES_DIR: app?.notesDir ?? 'release-notes',
  APP_DIR: appDir,
  BRANCH: branch,
  PREPARE_STEPS: ctx.stepsAt('beforeInstall', 'linux', null, 'prepare'),
  PREPARE_AFTER_INSTALL: ctx.stepsAt('prepare', 'linux', null, 'prepare'),
  SET_VERSION,
  JOBS: jobs.map(jobBlock).join('').replace(/^\n/, ''),
  NEEDS: `[${['prepare', ...jobs.map((job) => job.id)].join(', ')}]`,
  DOWNLOADS: jobs.flatMap((job) => job.downloads ?? []).map(downloadLine).join('\n') || '            echo "No platform builds a download."',
});

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
 * @param {Job[]} platformJobs
 * @param {{ appDir: string, app: AppOfMany | null, baselines: boolean, branch: string, ctx: JobContext }} where
 */
const ciText = (platformJobs, { appDir, app, baselines, branch, ctx }) => {
  const review = reviewJobValues({ baselines, app });
  const appJobs = fillTemplate(RELEASE_DIR, 'ci-app-jobs.yml.tmpl', {
    ROOT_STEPS: app ? '' : rootSteps(), ARTIFACT: app ? `-${app.name}` : '', REVIEW_RUNNER, ...review,
    ...jobSteps(ctx, 'QUALITY', 'quality'), ...jobSteps(ctx, 'REVIEW', 'review'), BEFORE_TEST: ctx.stepsAt('beforeTest', 'linux', null, 'quality'),
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
  });
};

/**
 * @param {{ targets: string[], appDir?: string, prefix: string, systemSteps?: ModuleCiStep[], steps?: CollectedSteps, app?: AppOfMany | null, baselines?: boolean, branch?: string }} input
 * @returns {{ ci: string, release: string, jobs: { ci: string[], release: string[] } }}
 */
const composeWorkflows = ({ targets, appDir = '.', prefix, systemSteps = [], steps = noWorkflowSteps(), app = null, baselines = false, branch = DEFAULT_BRANCH }) => {
  const { platforms } = resolvePlatforms(targets);
  const ciCtx = jobContext({ appDir, prefix, systemSteps, steps }, 'ci');
  const releaseCtx = jobContext({ appDir, prefix, systemSteps, steps }, 'release');
  const ciJobs = platforms.flatMap((platform) => (platform.ciJob ? [platform.ciJob(ciCtx)] : []));
  const releaseJobs = platforms.flatMap((platform) => (platform.releaseJob ? [platform.releaseJob(releaseCtx)] : []));
  return {
    ci: `${ciText(ciJobs, { appDir, app, baselines, branch, ctx: ciCtx }).trimEnd()}\n`,
    release: `${releaseText(releaseJobs, { appDir, app, branch, ctx: releaseCtx }).trimEnd()}\n`,
    jobs: {
      ci: [...(app ? ['changes'] : []), 'quality', 'review', ...ciJobs.map((job) => job.id)],
      release: ['prepare', ...releaseJobs.map((job) => job.id), 'release'],
    },
  };
};

/**
 * @param {ModuleCiStep[]} systemSteps
 * @param {string} [branch] the default branch, where a push runs it
 * @param {CollectedSteps} [steps] the shared steps
 * @returns {string} the workspace ci.yml of a repo of apps
 */
const workspaceCi = (systemSteps = [], branch = DEFAULT_BRANCH, steps = noWorkflowSteps()) => {
  const ctx = jobContext({ appDir: '.', prefix: '', systemSteps, steps }, 'ci');
  return `${fillTemplate(RELEASE_DIR, 'ci-workspace-workflow.yml.tmpl', {
    SETUP: ctx.setup('linux', { job: 'workspace' }),
    BEFORE_TEST: ctx.stepsAt('beforeTest', 'linux', null, 'workspace'),
    ROOT_STEPS: rootSteps(),
    BRANCH: branch,
  }).trimEnd()}\n`;
};

export { composeWorkflows, workspaceCi };
