/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { virtualStoreOf } from '@drizztdourden08/build-cache/vite-deps';

const packageDirOf = (appRequire, name) => {
  try {
    return realpathSync(dirname(appRequire.resolve(`${name}/package.json`)));
  } catch {
    return null;
  }
};

/**
 * @param {string} rootDir the app root
 * @param {string[]} sources the source packages the renderer compiles
 * @param {(root: string) => string} workspaceRootOf vite's searchForWorkspaceRoot
 * @returns {string[]} the workspace, linked sources, the package store
 */
const servedDirs = (rootDir, sources, workspaceRootOf) => {
  const appRequire = createRequire(join(rootDir, 'package.json'));
  const linked = sources.map((name) => packageDirOf(appRequire, name)).filter((dir) => dir !== null);
  const workspace = workspaceRootOf(rootDir);
  const packages = virtualStoreOf(workspace);
  return [...new Set([workspace, ...linked, packages])];
};

export { servedDirs };
