/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_PACKAGE } from './brand-files.mjs';
import { tesseraDir } from './tessera-dir.mjs';

/**
 * @param {string} rootDir The app root
 * @param {string} brand The Tessera brand id
 * @returns {string} Absolute brand folder inside the Tessera package
 */
const locateBrand = (rootDir, brand) => {
  const dir = join(tesseraDir(rootDir), 'brand', brand);
  if (!existsSync(dir)) throw new Error(`icons.brand is "${brand}" but ${TESSERA_PACKAGE} has no brand folder at ${dir}`);
  return dir;
};

export { locateBrand };
