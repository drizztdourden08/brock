/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expandGlob, globBase, workspaceGlobs } from '@drizztdourden08/standards/structure';

const APP_MARKER = 'brock.config.ts';

/**
 * @param {string} rootDir
 * @returns {string[]} app folders relative to the root; `.` for a root app
 */
const appDirs = (rootDir) => {
  if (existsSync(join(rootDir, APP_MARKER))) return ['.'];
  const { globs, declared } = workspaceGlobs(rootDir);
  if (!declared) return [];
  const bases = new Set(globs.map(globBase));
  return globs
    .flatMap((glob) => expandGlob(rootDir, glob, bases))
    .filter((dir) => existsSync(join(dir, APP_MARKER)))
    .map((dir) => relative(rootDir, dir).replace(/\\/g, '/'));
};

export { appDirs };
