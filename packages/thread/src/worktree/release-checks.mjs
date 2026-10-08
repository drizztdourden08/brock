/* @layer tooling-scripts @kind logic */
import { git } from '../git.mjs';
import { branchLanded } from './branch-merged.mjs';
import { guards } from './guards.mjs';
import { threadBase } from './thread-base.mjs';

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @param {string} verb the verb refusing, for the message
 * @returns {{ branch: string, base: string, landed: { landed: boolean, via: string | null } }}
 */
const assertReleasable = (worktree, ctx, verb) => {
  const { name, path, main, workspace } = worktree;
  guards.assertNotProtected(path, main);
  guards.assertNotRunning(name);
  guards.assertClean(path, verb);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], path);
  const { base } = threadBase.baseOf(branch, main, workspace);
  const landed = branchLanded(branch, main, base);
  if (!landed.landed) guards.assertPushed({ worktreePath: path, branch, base, alias: workspace.name });
  guards.assertNoStash(path, name);
  return { branch, base, landed };
};

export { assertReleasable };
