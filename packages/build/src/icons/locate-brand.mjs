/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { TESSERA_PACKAGE } from './brand-files.mjs';

const tesseraDir = (rootDir) => {
  const appRequire = createRequire(join(rootDir, 'package.json'));
  try {
    return dirname(appRequire.resolve(`${TESSERA_PACKAGE}/package.json`));
  } catch {
    throw new Error(`icons.brand is set but ${TESSERA_PACKAGE} is not installed in ${rootDir}. Add it to dependencies and run pnpm install.`);
  }
};

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
