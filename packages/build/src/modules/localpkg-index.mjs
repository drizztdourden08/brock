/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LOCALPKG_INDEX_FILE, localpkgHome } from './localpkg.constants.mjs';

/**
 * @param {string} packageName
 * @returns {string} the version of the local build
 */
const localpkgVersion = (packageName) => {
  const file = join(localpkgHome(), LOCALPKG_INDEX_FILE);
  const version = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).packages?.[packageName]?.version : undefined;
  if (!version) throw new Error(`${packageName} is not in the localpkg index (${file}). Run \`localpkg publish <producer>\` first, then retry.`);
  return version;
};

export { localpkgVersion };
