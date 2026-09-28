/* @layer tooling-scripts @kind logic */
import { git, remoteBranch } from '../git.mjs';
import { resolveWorktreeName } from '../worktree/current.mjs';
import { worktreePathFor } from '../worktree/paths.mjs';

const USER_DATA_LINE = '?? .user-data/';

const target = (positional, ctx) => {
  const { workspace } = ctx;
  const name = resolveWorktreeName(positional);
  const path = worktreePathFor(name, workspace);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], path);
  if (branch === 'HEAD') throw new Error(`"${name}" is on a detached HEAD. Check out a branch before publishing from it.`);
  if (workspace.protectedBranches.includes(branch)) {
    throw new Error(`"${name}" is on "${branch}", which is a base branch. Work goes on its own branch and reaches ${workspace.base} through a merged pull request.`);
  }
  return { name, path, branch };
};

const warnIfDirty = (path, log) => {
  const dirty = git(['status', '--porcelain'], path).split('\n').filter((line) => line && line.trim() !== USER_DATA_LINE);
  if (dirty.length === 0) return;
  log(`${dirty.length} uncommitted change(s) in this worktree are NOT part of what goes up. Commit them first if they belong in this branch.`);
};

const unpushedCount = (path, branch) => {
  const upstream = remoteBranch(branch, path);
  if (!upstream) return { upstream: null, count: null };
  return { upstream, count: Number(git(['rev-list', '--count', `${upstream}..HEAD`], path)) };
};

const prBranch = Object.freeze({ target, unpushedCount, warnIfDirty });

export { prBranch };
