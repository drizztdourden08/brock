/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { workspaceDirs } from '../workspace-dirs.mjs';

const APP_MARKER = 'brock.config.ts';

/**
 * @param {string} rootDir
 * @returns {string[]} app folders relative to the root; `.` for a root app
 */
const appDirs = (rootDir) => {
  if (existsSync(join(rootDir, APP_MARKER))) return ['.'];
  return workspaceDirs(rootDir)
    .filter((dir) => existsSync(join(dir, APP_MARKER)))
    .map((dir) => relative(rootDir, dir).replace(/\\/g, '/'));
};

export { appDirs };
