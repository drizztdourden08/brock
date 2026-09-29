/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const NAME_RULE = /^[a-z0-9][a-z0-9-]{0,38}$/;
const MAIN_CHECKOUT = 'main';

const assertName = (name) => {
  if (!name || !NAME_RULE.test(name)) throw new Error(`"${name ?? ''}" is not a valid worktree name: lowercase letters, digits and dashes, at most 39 characters.`);
  if (name === MAIN_CHECKOUT) throw new Error(`"${MAIN_CHECKOUT}" names the main checkout, not a worktree. Pick another name.`);
  return name;
};

const mainCheckout = (cwd = process.cwd()) => {
  const common = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  return resolve(common, '..');
};

const isWorktreeCheckout = (dir) => {
  const gitPath = join(dir, '.git');
  return existsSync(gitPath) && statSync(gitPath).isFile();
};

const registeredWorktrees = (main) => {
  try {
    return execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: main, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
      .split('\n')
      .filter((line) => line.startsWith('worktree '))
      .map((line) => resolve(line.slice(9)));
  } catch {
    return [];
  }
};

/**
 * @param {string} name
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @param {string} [cwd]
 * @returns {string}
 */
const worktreePathFor = (name, workspace, cwd = process.cwd()) => {
  if (basename(cwd) === name && isWorktreeCheckout(cwd)) return cwd;
  const main = mainCheckout(cwd);
  const registered = registeredWorktrees(main).find((path) => basename(path) === name && path !== resolve(main));
  return registered ?? join(main, workspace.worktreesDir, name);
};

export { assertName, isWorktreeCheckout, mainCheckout, registeredWorktrees, worktreePathFor, MAIN_CHECKOUT };
