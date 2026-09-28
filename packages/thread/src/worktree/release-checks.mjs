/* @layer tooling-scripts @kind logic */
import { git } from '../git.mjs';
import { branchLanded } from './branch-merged.mjs';
import { guards } from './guards.mjs';

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @param {string} verb the verb refusing, for the message
 * @returns {{ branch: string, landed: { landed: boolean, via: string | null } }}
 */
const assertReleasable = (worktree, ctx, verb) => {
  const { name, path, main, workspace } = worktree;
  guards.assertNotProtected(path, main);
  guards.assertNotRunning(name);
  guards.assertClean(path, verb);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], path);
  const landed = branchLanded(branch, main, workspace.base);
  if (!landed.landed) guards.assertPushed({ worktreePath: path, branch, base: workspace.base, alias: workspace.name });
  guards.assertNoStash(path, name);
  return { branch, landed };
};

export { assertReleasable };
