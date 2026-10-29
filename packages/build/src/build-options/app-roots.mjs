/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';

const realOf = (dir) => {
  try {
    return realpathSync.native(dir);
  } catch {
    return dir;
  }
};

/**
 * @param {string} rootDir the app folder
 * @returns {string[]} the folder, and its real path when different
 */
const appRoots = (rootDir) => [...new Set([resolve(rootDir), realOf(resolve(rootDir))])];

export { appRoots };
