/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { TESSERA_PACKAGE } from './brand-files.mjs';

/**
 * @param {string} rootDir The app root
 * @returns {string} The installed Tessera package folder
 */
const tesseraDir = (rootDir) => {
  const appRequire = createRequire(join(rootDir, 'package.json'));
  try {
    return dirname(appRequire.resolve(`${TESSERA_PACKAGE}/package.json`));
  } catch {
    throw new Error(`${TESSERA_PACKAGE} is not installed in ${rootDir}. Add it to dependencies and run pnpm install.`);
  }
};

export { tesseraDir };
