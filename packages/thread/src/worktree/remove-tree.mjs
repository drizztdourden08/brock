/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { gitLoud, LONG_PATHS, tryGit } from '../git.mjs';
import { deleteTree } from './delete-tree.mjs';
import { ignoredFolders } from './ignored-folders.mjs';

const assertTrackedClean = (path) => {
  const dirty = tryGit([...LONG_PATHS, 'status', '--porcelain', '--untracked-files=no'], path);
  if (dirty) throw new Error(`Refusing to delete ${path}: tracked files have uncommitted changes:\n${dirty.split('\n').slice(0, 10).join('\n')}`);
};

const clearIgnored = async (path) => {
  const failures = [];
  for (const folder of ignoredFolders(path)) {
    const failure = await deleteTree(path, folder);
    if (failure) failures.push(failure);
  }
  return failures;
};

const reportLocked = (failures, log) => {
  for (const { path, code } of failures.slice(0, 5)) log(`Could not delete ${path} (${code}); something holds it open.`);
};

/**
 * @param {string} path the worktree directory
 * @param {string} main the main checkout
 * @param {(message: string) => void} log
 * @returns {Promise<boolean>} true when the directory is gone
 */
const removeTree = async (path, main, log) => {
  assertTrackedClean(path);
  const failures = await clearIgnored(path);
  try {
    gitLoud([...LONG_PATHS, 'worktree', 'remove', path], main);
  } catch {
    log('git could not delete it in one pass. Retrying the directory directly.');
    const failure = await deleteTree(path, path);
    if (failure) failures.push(failure);
  }
  tryGit([...LONG_PATHS, 'worktree', 'prune'], main);
  const gone = !existsSync(path);
  if (!gone) reportLocked(failures, log);
  return gone;
};

export { removeTree };
