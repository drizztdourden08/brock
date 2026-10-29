/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, realpathSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { gitAt, LONG_PATHS } from '../git.mjs';
import { isStrictlyInside } from '../worktree/delete-tree.mjs';
import { registeredWorktrees } from '../worktree/paths.mjs';
import { removeTree } from '../worktree/remove-tree.mjs';
import { samePath } from '../worktree/same-path.mjs';

/**
 * @param {string} main the main checkout
 * @returns {string} <parent>/.brock-ci/<repo>, outside the checkout
 */
const ciWorktreesFolder = (main) => join(dirname(resolve(main)), '.brock-ci', basename(resolve(main)));

const assertOutsideCheckouts = (folder, main) => {
  const checkouts = [resolve(main), ...registeredWorktrees(main)];
  const around = checkouts.find((checkout) => samePath(checkout, folder) || isStrictlyInside(checkout, folder));
  if (around) throw new Error(`The runner keeps its temporary worktree outside every checkout, and ${folder} is inside the checkout ${around}.`);
};

/**
 * @param {{ main: string, runId: string, sha: string }} request
 * @returns {string} its path
 */
const addCiWorktree = ({ main, runId, sha }) => {
  const folder = ciWorktreesFolder(main);
  assertOutsideCheckouts(folder, main);
  mkdirSync(folder, { recursive: true });
  const path = join(folder, `ci-${runId.slice(9, 15)}${runId.slice(-4)}`);
  gitAt([...LONG_PATHS, 'worktree', 'add', '--quiet', '--detach', path, sha], resolve(main));
  return path;
};

/**
 * @param {string} root the temporary worktree
 * @param {string} cwd a step's working directory
 * @returns {boolean} true when inside root, by path and real path
 */
const isInsideWorktree = (root, cwd) => {
  const within = (folder, path) => samePath(folder, path) || isStrictlyInside(folder, path);
  if (!within(resolve(root), resolve(cwd))) return false;
  return !existsSync(cwd) || within(realpathSync.native(root), realpathSync.native(cwd));
};

/**
 * @param {{ path: string, main: string, log: (message: string) => void }} request
 * @returns {Promise<string | null>} why it stayed, or null when it is gone
 */
const dropCiWorktree = async ({ path, main, log }) => {
  try {
    return (await removeTree(path, main, log, ciWorktreesFolder(main))) ? null : `The temporary worktree ${path} could not be removed; something holds it open.`;
  } catch (error) {
    return `The temporary worktree ${path} was left in place: ${error.message.split('\n')[0]}`;
  }
};

export { addCiWorktree, ciWorktreesFolder, dropCiWorktree, isInsideWorktree };
