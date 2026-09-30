/* @layer tooling-scripts @kind logic */
import { fillTemplate } from './fill-template.mjs';
import { HOST_OS, RELEASE_DIR } from './workflows.constants.mjs';

/**
 * @typedef {object} DesktopJob
 * @property {string} platform the platform id, also the artifact suffix
 * @property {string} runsOn a GitHub runner label
 * @property {boolean} vpk pack with Velopack after electron-builder
 * @property {string[]} collect release files, from the app folder
 * @property {import('../platforms/platform.type.mjs').Download[]} downloads
 */

/**
 * @param {DesktopJob} job
 * @returns {(ctx: import('../platforms/platform.type.mjs').JobContext) => import('../platforms/platform.type.mjs').Job}
 */
const desktopReleaseJob = (job) => (ctx) => ({
  id: `build-${job.platform}`,
  downloads: job.downloads,
  text: fillTemplate(RELEASE_DIR, 'desktop-release-job.yml.tmpl', {
    JOB: `build-${job.platform}`,
    RUNS_ON: job.runsOn,
    PLATFORM: job.platform,
    SETUP: ctx.setup(HOST_OS[job.runsOn], { release: true }),
    VPK: job.vpk ? fillTemplate(RELEASE_DIR, 'vpk-steps.yml.tmpl', {}) : '',
    COLLECT: job.collect.map((glob) => `          cp "$APP_DIR"/${glob} upload/`).join('\n'),
  }),
});

export { desktopReleaseJob };
