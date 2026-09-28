/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { detachAllLinks } from './reparse-scan.mjs';

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<boolean>} true when a directory was deleted
 */
const clearUserData = async (worktree, ctx) => {
  const { userData, log } = worktree;
  if (!existsSync(userData)) return false;
  for (const step of ctx.provision) {
    if (typeof step.afterLaunch === 'function') await step.afterLaunch(worktree);
  }
  const links = detachAllLinks(userData, log);
  if (links.length > 0) log(`Detached ${links.length} stray link(s) before deleting .user-data.`);
  rmSync(userData, { recursive: true, force: true });
  return true;
};

export { clearUserData };
