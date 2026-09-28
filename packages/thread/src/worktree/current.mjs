/* @layer tooling-scripts @kind logic */
import { basename, resolve } from 'node:path';
import { isWorktreeCheckout, mainCheckout } from './paths.mjs';

const currentWorktreeName = () => {
  const cwd = process.cwd();
  if (!isWorktreeCheckout(cwd)) return null;
  try {
    if (resolve(cwd) === resolve(mainCheckout(cwd))) return null;
  } catch {
    return null;
  }
  return basename(cwd);
};

const resolveWorktreeName = (positional) => {
  const [name] = positional;
  if (name) return name;
  const current = currentWorktreeName();
  if (current) return current;
  throw new Error('Name the worktree, or run this from inside one.');
};

export { resolveWorktreeName };
