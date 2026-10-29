/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { LONG_PATHS, tryGitAt } from '../git.mjs';
import { samePath } from './same-path.mjs';

/**
 * @param {string} root the worktree folder
 * @returns {string[]} absolute paths, empty unless git answers for root
 */
const ignoredFolders = (root) => {
  const top = tryGitAt(['rev-parse', '--show-toplevel'], root);
  if (!top || !samePath(top, root)) return [];
  const listed = tryGitAt([...LONG_PATHS, 'ls-files', '--others', '--ignored', '--exclude-standard', '--directory', '-z'], root);
  if (!listed) return [];
  const folders = [...new Set(listed.split('\0').filter((entry) => entry.endsWith('/') && entry !== '.git/'))].sort();
  return folders.filter((entry, index) => !folders.slice(0, index).some((parent) => entry.startsWith(parent))).map((entry) => resolve(root, entry));
};

export { ignoredFolders };
