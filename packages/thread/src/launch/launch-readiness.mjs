/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * @param {string} app the app folder, from the worktree
 * @param {string} userData the data folder, from the worktree
 * @returns {{ app: (worktree: { path: string }) => string, userData: (worktree: { path: string }) => string }} where a worktree keeps them
 */
const targetDirs = (app, userData) => ({
  app: (worktree) => resolve(worktree.path, app),
  userData: (worktree) => resolve(worktree.path, userData),
});

/**
 * @param {ReturnType<typeof targetDirs>} dirs
 * @param {string} userData the data folder name, for the message
 * @param {(appDir: string) => string | null} productionProblem why a production build cannot start, or null
 * @returns {(worktree: import('../workspace/workspace.type.mjs').WorktreeContext, prod: boolean) => string | null} a message when a launch cannot start
 */
const notReadyWith = (dirs, userData, productionProblem) => (worktree, prod) => {
  if (!existsSync(dirs.userData(worktree))) {
    return `"${worktree.name}" has no ${userData} folder. Run: ${worktree.workspace.name} worktree create ${worktree.name}`;
  }
  const problem = prod ? productionProblem(dirs.app(worktree)) : null;
  if (problem) return `"${worktree.name}" has no complete production build (${problem}). Build it first, or launch without --prod.`;
  return null;
};

export { notReadyWith, targetDirs };
