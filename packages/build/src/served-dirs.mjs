/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

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
 * @returns {string[]} the workspace and every linked source package
 */
const servedDirs = (rootDir, sources, workspaceRootOf) => {
  const appRequire = createRequire(join(rootDir, 'package.json'));
  const linked = sources.map((name) => packageDirOf(appRequire, name)).filter((dir) => dir !== null);
  return [...new Set([workspaceRootOf(rootDir), ...linked])];
};

export { servedDirs };
