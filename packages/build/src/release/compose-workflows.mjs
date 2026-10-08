/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from '../platforms/resolve-platforms.mjs';
import { fillTemplate } from './fill-template.mjs';
import { BASELINE_REVIEW, PLAIN_REVIEW } from './review-job.constants.mjs';
import { setupSteps } from './setup-steps.mjs';
import { RELEASE_DIR } from './workflows.constants.mjs';

/**
 * @typedef {import('../platforms/platform.type.mjs').Job} Job
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
 */

const jobBlock = (job) => `\n${job.text.trimEnd()}\n`;

const downloadLine = (download) => `            ${download.latest ? 'stub' : 'link'} "${download.glob}" "${download.label}"`;

/**
 * @param {Job[]} jobs
 * @param {string} appDir
 */
const releaseText = (jobs, appDir) => fillTemplate(RELEASE_DIR, 'release-workflow.yml.tmpl', {
  APP_DIR: appDir,
  JOBS: jobs.map(jobBlock).join('').replace(/^\n/, ''),
  NEEDS: `[${['prepare', ...jobs.map((job) => job.id)].join(', ')}]`,
  DOWNLOADS: jobs.flatMap((job) => job.downloads ?? []).map(downloadLine).join('\n') || '            echo "No platform builds a download."',
});

/**
 * @param {{ targets: string[], appDir?: string, prefix: string, systemSteps?: ModuleCiStep[], baselines?: boolean }} input
 * @returns {{ ci: string, release: string, jobs: { ci: string[], release: string[] } }}
 */
const composeWorkflows = ({ targets, appDir = '.', prefix, systemSteps = [], baselines = false }) => {
  const { platforms } = resolvePlatforms(targets);
  const ctx = { appDir, prefix, setup: (os, opts = {}) => setupSteps({ os, release: opts.release, systemSteps }) };
  const ciJobs = platforms.flatMap((platform) => (platform.ciJob ? [platform.ciJob(ctx)] : []));
  const releaseJobs = platforms.flatMap((platform) => (platform.releaseJob ? [platform.releaseJob(ctx)] : []));
  const ci = fillTemplate(RELEASE_DIR, 'ci-workflow.yml.tmpl', {
    APP_DIR: appDir,
    SETUP: ctx.setup('linux'),
    PLATFORM_JOBS: ciJobs.map(jobBlock).join(''),
    ...(baselines ? BASELINE_REVIEW : PLAIN_REVIEW),
  });
  return {
    ci: `${ci.trimEnd()}\n`,
    release: `${releaseText(releaseJobs, appDir).trimEnd()}\n`,
    jobs: { ci: ['quality', 'review', ...ciJobs.map((job) => job.id)], release: ['prepare', ...releaseJobs.map((job) => job.id), 'release'] },
  };
};

export { composeWorkflows };
