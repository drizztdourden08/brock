/* @layer tooling-scripts @kind logic */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { gitLoud, LONG_PATHS } from '../git.mjs';
import { excludeWorktrees } from '../worktree/exclude-worktrees.mjs';
import { removeTree } from '../worktree/remove-tree.mjs';

/**
 * @param {{ main: string, worktreesDir: string, runId: string, sha: string }} request
 * @returns {string} its path
 */
const addCiWorktree = ({ main, worktreesDir, runId, sha }) => {
  const path = join(main, worktreesDir, `ci-${runId.slice(9, 15)}${runId.slice(-4)}`);
  mkdirSync(join(main, worktreesDir), { recursive: true });
  excludeWorktrees(main, worktreesDir);
  gitLoud([...LONG_PATHS, 'worktree', 'add', '--detach', path, sha], main);
  return path;
};

/**
 * @param {{ path: string, main: string, log: (message: string) => void }} request
 * @returns {Promise<string | null>} why it stayed, or null when it is gone
 */
const dropCiWorktree = async ({ path, main, log }) => {
  try {
    return (await removeTree(path, main, log)) ? null : `The temporary worktree ${path} could not be removed; something holds it open.`;
  } catch (error) {
    return `The temporary worktree ${path} was left in place: ${error.message.split('\n')[0]}`;
  }
};

export { addCiWorktree, dropCiWorktree };
