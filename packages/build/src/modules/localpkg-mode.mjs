/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LOCALPKG_MARKER, LOCALPKG_PNPMFILE } from './localpkg.constants.mjs';

const hasMarker = (dir) => {
  const file = join(dir, LOCALPKG_PNPMFILE);
  return existsSync(file) && readFileSync(file, 'utf8').includes(LOCALPKG_MARKER);
};

/**
 * @param {string} rootDir the app folder
 * @returns {boolean} true when a localpkg hook is in the app or its root
 */
const isLocalpkgMode = (rootDir) => {
  let current = rootDir;
  for (;;) {
    if (hasMarker(current)) return true;
    const parent = dirname(current);
    if (parent === current || existsSync(join(current, '.git'))) return false;
    current = parent;
  }
};

export { isLocalpkgMode };
