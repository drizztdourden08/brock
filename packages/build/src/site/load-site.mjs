/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SITE_CONFIG_FILE } from './site.constants.mjs';

/**
 * @param {string} siteDir the folder holding brock.site.ts
 * @returns {Promise<import('./define-brock-site.mjs').BrockSite>}
 */
const loadSite = async (siteDir) => {
  const file = join(siteDir, SITE_CONFIG_FILE);
  if (!existsSync(file)) throw new Error(`No ${SITE_CONFIG_FILE} in ${siteDir}`);
  const site = (await import(pathToFileURL(file).href)).default;
  if (!site?.site?.id || !site.ports) throw new Error(`${SITE_CONFIG_FILE} must default-export defineBrockSite({ ... })`);
  return site;
};

/**
 * @param {string} dir
 * @returns {boolean}
 */
const isSiteDir = (dir) => existsSync(join(dir, SITE_CONFIG_FILE));

export { loadSite, isSiteDir };
