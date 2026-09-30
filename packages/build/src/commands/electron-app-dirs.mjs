/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';

/**
 * @param {{ targets?: Record<string, { kind?: string, appDir?: (worktree: object) => string }> }} workspace
 * @param {string} rootDir the repo root, standing in for the main checkout
 * @returns {string[]} absolute electron app folders, first seen first
 */
const electronAppDirs = (workspace, rootDir) => {
  const checkout = { name: 'main', path: rootDir, main: rootDir };
  const dirs = Object.values(workspace.targets ?? {})
    .filter((target) => target?.kind === 'electron' && typeof target.appDir === 'function')
    .map((target) => resolve(target.appDir(checkout)));
  return [...new Set(dirs)];
};

export { electronAppDirs };
