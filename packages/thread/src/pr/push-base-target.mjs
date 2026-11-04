/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { git, tryGit } from '../git.mjs';
import { isWorktreeCheckout, mainCheckout } from '../worktree/paths.mjs';

/**
 * @param {string[]} positional
 * @param {{ workspace: import('../workspace/workspace.type.mjs').Workspace }} ctx
 * @returns {{ path: string, branch: string } | null} null when not a base push
 */
const baseTarget = (positional, ctx) => {
  const { base } = ctx.workspace;
  const cwd = process.cwd();
  const root = mainCheckout(cwd);
  const head = tryGit(['rev-parse', '--abbrev-ref', 'HEAD'], root);
  const [name] = positional;
  if (name) {
    if (name !== base) return null;
    if (head !== base) throw new Error(`The main checkout is on "${head}", not on ${base}. Check out ${base} there to push it.`);
    return { path: root, branch: base };
  }
  const inMain = !isWorktreeCheckout(cwd) && resolve(git(['rev-parse', '--show-toplevel'], cwd)) === resolve(root);
  return inMain && head === base ? { path: root, branch: base } : null;
};

export { baseTarget };
