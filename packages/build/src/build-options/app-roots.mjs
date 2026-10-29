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
 * @returns {string[]} the folder as written and its real path, when they differ (pnpm links)
 */
const appRoots = (rootDir) => [...new Set([resolve(rootDir), realOf(resolve(rootDir))])];

export { appRoots };
