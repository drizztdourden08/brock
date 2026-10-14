/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadSite } from './load-site.mjs';
import { SITE_SERVED_DIRS } from './site.constants.mjs';

/**
 * @param {string} siteDir the site folder
 * @param {import('./define-brock-site.mjs').BrockSite} site
 * @param {string} label the site folder as the message names it
 * @returns {string[]} each served folder whose name the /api proxy takes over
 */
const proxyCollisions = (siteDir, site, label) => {
  const first = site.api?.path.split('/').find(Boolean);
  if (!first) return [];
  return SITE_SERVED_DIRS.filter((dir) => existsSync(join(siteDir, dir, first))).map((dir) =>
    `${label}/${dir}/${first}: the dev server serves ${dir} at the page root, so a request for /${first}/... goes to the ${site.api.path} proxy instead of this folder and the page stays blank. Rename the folder, or move the proxy with api.path in brock.site.ts.`);
};

/**
 * @param {string} repoRoot
 * @param {string[]} sites the site folders, from the repo root
 * @param {string} command the command, for the lines
 * @returns {Promise<number>} how many collisions it warned about
 */
const warnProxyCollisions = async (repoRoot, sites, command) => {
  const found = [];
  for (const dir of sites) found.push(...proxyCollisions(join(repoRoot, dir), await loadSite(join(repoRoot, dir)), dir));
  for (const line of found) console.warn(`${command}: ${line}`);
  return found.length;
};

export { proxyCollisions, warnProxyCollisions };
