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
  ci: (ctx) => ({ id: 'web', text: fillTemplate(WEB_TEMPLATES, 'web-ci-job.yml.tmpl', { SETUP: ctx.setup('linux') }) }),
  release: (ctx) => ({
    id: 'build-web',
    downloads: [{ glob: 'artifacts/release-web/*.zip', label: 'Web build (.zip), static files to host on any web server' }],
    text: fillTemplate(WEB_TEMPLATES, 'web-release-job.yml.tmpl', { SETUP: ctx.setup('linux', { release: true }), ZIP: `${ctx.prefix}web.zip` }),
  }),
};

export { webJobs };
