/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { deleteTree } from './delete-tree.mjs';

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<boolean>} true when a directory was deleted
 */
const clearUserData = async (worktree, ctx) => {
  const { userData, path, main } = worktree;
  if (!existsSync(userData)) return false;
  for (const step of ctx.provision) {
    if (typeof step.afterLaunch === 'function') await step.afterLaunch(worktree);
  }
  const failure = await deleteTree({ owner: path, target: userData, mains: [main] });
  if (failure) throw new Error(`Could not delete ${failure.path} (${failure.code}); something holds it open. Close it and run the same command again.`);
  return true;
};

export { clearUserData };
