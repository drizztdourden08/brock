/* @layer tooling-scripts @kind logic */
import { tryGit } from '../git.mjs';

const deleteRemote = ({ branch, cwd, via, log }) => {
  if (!tryGit(['ls-remote', '--heads', 'origin', branch], cwd)) {
    log(`Branch "${branch}" deleted locally; the remote copy was already gone (${via}).`);
    return;
  }
  if (tryGit(['push', 'origin', '--delete', branch], cwd) !== null) {
    log(`Branch "${branch}" deleted, local and remote (${via}).`);
    return;
  }
  log(`Branch "${branch}" deleted locally, but origin refused the remote delete (${via}). The remote branch is still there; delete it yourself if it should go.`);
};

/**
 * @param {{ branch: string, cwd: string, via: string, ctx: import('../workspace/workspace.type.mjs').ThreadContext }} request
 * @returns {void}
 */
const deleteBranch = ({ branch, cwd, via, ctx }) => {
  const { log, workspace } = ctx;
  if (branch === 'HEAD') {
    log('Detached HEAD, so there is no branch to delete.');
    return;
  }
  if (workspace.protectedBranches.includes(branch)) {
    log(`Branch "${branch}" kept: a protected branch is never deleted with a worktree.`);
    return;
  }
  if (tryGit(['branch', '-D', branch], cwd) === null) {
    log(`Branch "${branch}" kept: ${via}, but git would not delete it (checked out elsewhere?).`);
    return;
  }
  deleteRemote({ branch, cwd, via, log });
};

export { deleteBranch };
