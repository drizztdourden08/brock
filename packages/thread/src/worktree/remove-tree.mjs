/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { gitAt, LONG_PATHS, tryGitAt } from '../git.mjs';
import { assertNotCheckout, deleteTree, isStrictlyInside } from './delete-tree.mjs';
import { ignoredFolders } from './ignored-folders.mjs';
import { removeLinksFirst } from './links-first.mjs';
import { samePath } from './same-path.mjs';

const assertOwnWorktree = ({ path, main, owner }) => {
  if (!isStrictlyInside(owner, path)) throw new Error(`Refusing to delete ${path}: it is not inside ${owner}, the folder this removal owns.`);
  assertNotCheckout(path, [main]);
  const top = tryGitAt(['rev-parse', '--show-toplevel'], path);
  if (top && !samePath(top, path)) throw new Error(`Refusing to delete ${path}: git answers for ${top} there, not for the worktree itself.`);
};

const assertTrackedClean = (path) => {
  const dirty = tryGitAt([...LONG_PATHS, 'status', '--porcelain', '--untracked-files=no'], path);
  if (dirty) throw new Error(`Refusing to delete ${path}: tracked files have uncommitted changes:\n${dirty.split('\n').slice(0, 10).join('\n')}`);
};

const clearIgnored = async (path, main) => {
  const failures = [];
  for (const folder of ignoredFolders(path)) {
    const failure = await deleteTree({ owner: path, target: folder, mains: [main] });
    if (failure) failures.push(failure);
  }
  return failures;
};

const reportLocked = (failures, gitError, log) => {
  if (gitError) log(gitError);
  for (const { path, code } of failures.slice(0, 5)) log(`Could not delete ${path} (${code}); something holds it open.`);
};

/**
 * @param {string} path the worktree directory
 * @param {string} main the main checkout
 * @param {(message: string) => void} log
 * @param {string} [owner] the folder no delete may leave
 * @returns {Promise<boolean>} true when the directory is gone
 */
const removeTree = async (path, main, log, owner = dirname(resolve(path))) => {
  const full = resolve(path);
  assertOwnWorktree({ path: full, main, owner: resolve(owner) });
  assertTrackedClean(full);
  const links = removeLinksFirst(full);
  if (links > 0) log(`Removed ${links} link(s) as links first, so nothing they point to is touched.`);
  const failures = await clearIgnored(full, main);
  let gitError = '';
  try {
    gitAt([...LONG_PATHS, 'worktree', 'remove', full], main);
  } catch (error) {
    gitError = String(error.stderr ?? error.message).trim();
    const failure = await deleteTree({ owner, target: full, mains: [main] });
    if (failure) failures.push(failure);
  }
  tryGitAt([...LONG_PATHS, 'worktree', 'prune'], main);
  const gone = !existsSync(full);
  if (gone && gitError) log('Git could not remove the folder in one pass, so Brock deleted it directly.');
  if (!gone) reportLocked(failures, gitError, log);
  return gone;
};

export { removeTree };
