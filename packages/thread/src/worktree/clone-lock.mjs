/* @layer tooling-scripts @kind logic */
import { LONG_PATHS, tryGitAt } from '../git.mjs';
import { samePath } from './same-path.mjs';

const CLONE_LOCK_REASON = 'cloned node_modules; remove with brock worktree remove';

const lockReasonOf = (path, main) => {
  const listing = tryGitAt([...LONG_PATHS, 'worktree', 'list', '--porcelain'], main) ?? '';
  const block = listing.split(/\r?\n\r?\n/).find((text) => samePath(text.split(/\r?\n/)[0].replace(/^worktree /, ''), path));
  return block?.split(/\r?\n/).find((line) => line.startsWith('locked'))?.slice('locked'.length).trim() ?? null;
};

/**
 * @param {string} path a worktree whose node_modules was cloned
 * @param {string} main the main checkout
 * @param {(message: string) => void} log
 * @returns {boolean} true when the lock is in place
 */
const lockClone = (path, main, log) => {
  const done = tryGitAt([...LONG_PATHS, 'worktree', 'lock', '--reason', CLONE_LOCK_REASON, path], main) !== null;
  if (!done) log(`Could not lock ${path}; remove it only with brock worktree remove.`);
  return done;
};

/**
 * @param {string} path a worktree whose links are already removed
 * @param {string} main the main checkout
 * @returns {boolean} true when Brock's own lock was lifted; any other lock stays
 */
const unlockClone = (path, main) => {
  if (lockReasonOf(path, main) !== CLONE_LOCK_REASON) return false;
  return tryGitAt([...LONG_PATHS, 'worktree', 'unlock', path], main) !== null;
};

export { CLONE_LOCK_REASON, lockClone, lockReasonOf, unlockClone };
