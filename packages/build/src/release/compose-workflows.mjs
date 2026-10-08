/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from '../platforms/resolve-platforms.mjs';
import { fillTemplate } from './fill-template.mjs';
import { REVIEW_RUNNER } from './review-job.constants.mjs';
import { reviewJobValues } from './review-job-values.mjs';
import { setupSteps } from './setup-steps.mjs';
import { DEFAULT_BRANCH, RELEASE_DIR, SET_VERSION } from './workflows.constants.mjs';

/**
 * @typedef {import('../platforms/platform.type.mjs').Job} Job
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
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
 * @param {Job[]} jobs
 * @param {{ appDir: string, app: AppOfMany | null }} where
 */
const releaseText = (jobs, { appDir, app }) => fillTemplate(RELEASE_DIR, 'release-workflow.yml.tmpl', {
  TITLE: app ? ` ${app.name}` : '',
  GROUP: app ? `-${app.name}` : '',
  APP_FLAG: app ? ` --app ${app.name}` : '',
  TAG_PREFIX: app?.tagPrefix ?? 'v',
  NOTES_DIR: app?.notesDir ?? 'release-notes',
  APP_DIR: appDir,
  SET_VERSION,
  JOBS: jobs.map(jobBlock).join('').replace(/^\n/, ''),
  NEEDS: `[${['prepare', ...jobs.map((job) => job.id)].join(', ')}]`,
  DOWNLOADS: jobs.flatMap((job) => job.downloads ?? []).map(downloadLine).join('\n') || '            echo "No platform builds a download."',
});

/**
 * @param {Job[]} platformJobs
 * @param {{ appDir: string, app: AppOfMany | null, setup: (os: string, opts?: object) => string, baselines: boolean, branch: string }} where
 */
const ciText = (platformJobs, { appDir, app, setup, baselines, branch }) => {
  const review = reviewJobValues({ baselines, app });
  const appJobs = fillTemplate(RELEASE_DIR, 'ci-app-jobs.yml.tmpl', { SETUP: setup('linux'), ROOT_STEPS: app ? '' : rootSteps(), ARTIFACT: app ? `-${app.name}` : '', REVIEW_RUNNER, ...review });
  const own = `${appJobs.trimEnd()}\n${platformJobs.map(jobBlock).join('')}`;
  const changes = app ? `${fillTemplate(RELEASE_DIR, 'ci-changes-job.yml.tmpl', { SETUP: setup('linux', { history: true }) }).trimEnd()}\n\n` : '';
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
 * @param {{ targets: string[], appDir?: string, prefix: string, systemSteps?: ModuleCiStep[], app?: AppOfMany | null, baselines?: boolean, branch?: string }} input
 * @returns {{ ci: string, release: string, jobs: { ci: string[], release: string[] } }}
 */
const composeWorkflows = ({ targets, appDir = '.', prefix, systemSteps = [], app = null, baselines = false, branch = DEFAULT_BRANCH }) => {
  const { platforms } = resolvePlatforms(targets);
  const setup = (os, opts = {}) => setupSteps({ os, release: opts.release, history: opts.history, systemSteps });
  const ctx = { appDir, prefix, setup };
  const ciJobs = platforms.flatMap((platform) => (platform.ciJob ? [platform.ciJob(ctx)] : []));
  const releaseJobs = platforms.flatMap((platform) => (platform.releaseJob ? [platform.releaseJob(ctx)] : []));
  return {
    ci: `${ciText(ciJobs, { appDir, app, setup, baselines, branch }).trimEnd()}\n`,
    release: `${releaseText(releaseJobs, { appDir, app }).trimEnd()}\n`,
    jobs: {
      ci: [...(app ? ['changes'] : []), 'quality', 'review', ...ciJobs.map((job) => job.id)],
      release: ['prepare', ...releaseJobs.map((job) => job.id), 'release'],
    },
  };
};

/**
 * @param {ModuleCiStep[]} systemSteps
 * @param {string} [branch] the default branch, where a push runs it
 * @returns {string} the workspace ci.yml of a repo of apps
 */
const workspaceCi = (systemSteps = [], branch = DEFAULT_BRANCH) => `${fillTemplate(RELEASE_DIR, 'ci-workspace-workflow.yml.tmpl', {
  SETUP: setupSteps({ os: 'linux', systemSteps }),
  ROOT_STEPS: rootSteps(),
  BRANCH: branch,
}).trimEnd()}\n`;

export { composeWorkflows, workspaceCi };
