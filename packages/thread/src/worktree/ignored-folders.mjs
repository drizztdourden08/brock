/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { LONG_PATHS, tryGit } from '../git.mjs';

/**
 * @param {string} root the worktree folder
 * @returns {string[]} absolute paths, empty when git cannot list them
 */
const ignoredFolders = (root) => {
  const listed = tryGit([...LONG_PATHS, 'ls-files', '--others', '--ignored', '--exclude-standard', '--directory', '-z'], root);
  if (!listed) return [];
  return listed
    .split('\0')
    .filter((entry) => entry.endsWith('/') && entry !== '.git/')
    .map((entry) => resolve(root, entry));
};

export { ignoredFolders };
