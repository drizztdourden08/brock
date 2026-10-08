/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SHARED_VIEWS_DIR, TESSERA_CONFIG_FILE } from '../tessera/tessera.constants.mjs';

const KNIP_FILE = 'knip.json';

const editJson = (file, edit) => {
  if (!existsSync(file)) return false;
  const value = JSON.parse(readFileSync(file, 'utf8'));
  if (!edit(value)) return false;
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return true;
};

const ROOT_KEYS = ['entry', 'project'];

const rootWorkspaceOf = (config) => {
  const root = Object.fromEntries(ROOT_KEYS.filter((key) => config[key]).map((key) => [key, config[key]]));
  for (const key of ROOT_KEYS) delete config[key];
  return Object.keys(root).length ? { '.': root } : {};
};

/**
 * @param {string} repoRoot
 * @param {string} siteDir from the repo root
 * @returns {string[]} its own views, then the shared views
 */
const siteViews = (repoRoot, siteDir) => [`${siteDir}/src/views`, ...(existsSync(join(repoRoot, SHARED_VIEWS_DIR)) ? [SHARED_VIEWS_DIR] : [])];

/**
 * @param {string} repoRoot
 * @param {string} siteDir from the repo root
 * @returns {string[]} the files it changed
 */
const registerSite = (repoRoot, siteDir) => {
  const views = siteViews(repoRoot, siteDir);
  const tessera = editJson(join(repoRoot, TESSERA_CONFIG_FILE), (config) => {
    config.apps ??= {};
    if (config.apps[siteDir]) return false;
    config.apps[siteDir] = { parts: { views: views.length === 1 ? views[0] : views }, theme: { css: `${siteDir}/src/theme.css` } };
    return true;
  });
  const knip = editJson(join(repoRoot, KNIP_FILE), (config) => {
    config.workspaces ??= rootWorkspaceOf(config);
    if (config.workspaces[siteDir]) return false;
    config.workspaces[siteDir] = { entry: ['src/main.tsx', 'brock.site.ts', 'vite.config.ts'], project: ['src/**/*.{ts,tsx}'] };
    return true;
  });
  return [...(tessera ? [TESSERA_CONFIG_FILE] : []), ...(knip ? [KNIP_FILE] : [])];
};

export { registerSite };
