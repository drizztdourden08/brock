/* @layer tooling-scripts @kind logic */
import { fillTemplate } from '../../release/fill-template.mjs';
import { WEB_TEMPLATES } from './web.constants.mjs';

/**
 * @typedef {import('../platform.type.mjs').JobContext} JobContext
 * @typedef {import('../platform.type.mjs').Job} Job
 */

/**
 * @type {{ ci: (ctx: JobContext) => Job, release: (ctx: JobContext) => Job }}
 */
const webJobs = {
  ci: (ctx) => ({
    id: 'web',
    text: fillTemplate(WEB_TEMPLATES, 'web-ci-job.yml.tmpl', {
      SETUP: ctx.setup('linux', { platform: 'web', job: 'web' }), BEFORE_BUILD: ctx.stepsAt('beforeBuild', 'linux', 'web', 'web'), AFTER_BUILD: ctx.stepsAt('afterBuild', 'linux', 'web', 'web'),
    }),
  }),
  release: (ctx) => ({
    id: 'build-web',
    downloads: [{ glob: 'artifacts/release-web/*.zip', label: 'Web build (.zip), static files to host on any web server' }],
    text: fillTemplate(WEB_TEMPLATES, 'web-release-job.yml.tmpl', {
      SETUP: ctx.setup('linux', { release: true, platform: 'web', job: 'build-web' }), ZIP: `${ctx.prefix}web.zip`,
      BEFORE_PACKAGE: ctx.stepsAt('beforePackage', 'linux', 'web', 'build-web'), AFTER_PACKAGE: ctx.stepsAt('afterPackage', 'linux', 'web', 'build-web'),
    }),
  }),
};

export { webJobs };
