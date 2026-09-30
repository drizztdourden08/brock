/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { gitLoud, tryGit } from '../git.mjs';

/**
 * @param {string} path the worktree directory
 * @param {string} main the main checkout
 * @param {(message: string) => void} log
 * @returns {boolean} true when the directory is gone
 */
const removeTree = (path, main, log) => {
  try {
    gitLoud(['worktree', 'remove', path], main);
  } catch {
    log('git could not delete it in one pass. Retrying the directory directly.');
    rmSync(path, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    tryGit(['worktree', 'prune'], main);
  }
  return !existsSync(path);
};

export { removeTree };
