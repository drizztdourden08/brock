/* @layer tooling-scripts @kind logic */
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fillTemplate } from '../release/fill-template.mjs';
import { setupSteps } from '../release/setup-steps.mjs';
import { RELEASE_DIR, WORKFLOWS_DIR } from '../release/workflows.constants.mjs';
import { loadSite } from './load-site.mjs';
import { SITE_TSCONFIG_FILE, SITE_VITE_CONFIG_FILE } from './site.constants.mjs';

const SITE_DIR = fileURLToPath(new URL('.', import.meta.url));

const pathsOf = (aliases) => Object.fromEntries(Object.entries(aliases).flatMap(([prefix, dir]) => {
  const folder = dir.replace(/\\/g, '/').replace(/\/$/, '');
  return [[prefix, [folder]], [`${prefix}/*`, [`${folder}/*`]]];
}));

/**
 * @param {Record<string, string>} aliases build.aliases of brock.site.ts
 * @returns {string} the managed tsconfig.json of a site
 */
const siteTsconfig = (aliases) => `${JSON.stringify({
  extends: '@drizztdourden08/brock-lint-config/tsconfig/react.json',
  compilerOptions: { types: ['node', 'vite/client'], paths: { '@app/*': ['./src/*'], ...pathsOf(aliases) } },
  include: ['src', 'brock.site.ts', 'vite.config.ts'],
  exclude: ['node_modules', 'dist'],
}, null, 2)}\n`;

/**
 * @param {string} appDir the site folder from the repo root
 * @returns {string} the managed ci-<name>.yml of a site
 */
const siteWorkflow = (appDir) => `${fillTemplate(SITE_DIR, 'site-ci-workflow.yml.tmpl', {
  NAME: basename(appDir),
  APP_DIR: appDir,
  CHANGES: fillTemplate(RELEASE_DIR, 'ci-changes-job.yml.tmpl', { SETUP: setupSteps({ os: 'linux', history: true, systemSteps: [] }) }).trimEnd(),
  SETUP: setupSteps({ os: 'linux', systemSteps: [] }),
}).trimEnd()}\n`;

/**
 * @param {string} repoRoot
 * @param {string} appDir the site folder from the repo root
 * @param {{ workflows: boolean }} opts workflows only in a repo that keeps managed workflows
 * @returns {Promise<{ path: string, content: string }[]>} from the repo root
 */
const renderSiteFiles = async (repoRoot, appDir, { workflows }) => {
  const site = await loadSite(join(repoRoot, appDir));
  return [
    { path: `${appDir}/${SITE_VITE_CONFIG_FILE}`, content: fillTemplate(SITE_DIR, 'site-vite.config.ts.tmpl', {}) },
    { path: `${appDir}/${SITE_TSCONFIG_FILE}`, content: siteTsconfig(site.build.aliases) },
    ...(workflows ? [{ path: `${WORKFLOWS_DIR}/ci-${basename(appDir)}.yml`, content: siteWorkflow(appDir) }] : []),
  ];
};

export { renderSiteFiles };
