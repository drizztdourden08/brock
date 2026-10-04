/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_PACKAGE } from './brand-files.mjs';
import { brandFolder } from './brand-folder.mjs';
import { tesseraDir } from './tessera-dir.mjs';

/**
 * @param {string} rootDir The app root
 * @param {string} brand The Tessera brand id
 * @param {'light' | 'dark' | null} [rim] Reads brand/<rim>-rim/<brand> instead
 * @returns {string} Absolute brand folder inside the Tessera package
 */
const locateBrand = (rootDir, brand, rim = null) => {
  const dir = join(tesseraDir(rootDir), brandFolder(brand, rim));
  if (!existsSync(dir)) throw new Error(`icons.brand is "${brand}"${rim ? ` with the ${rim} rim` : ''} but ${TESSERA_PACKAGE} has no brand folder at ${dir}`);
  return dir;
};

export { locateBrand };
