/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { git, tryGit } from '../git.mjs';
import { resolveWorktreeName } from './current.mjs';
import { isWorktreeName, worktreePathFor } from './paths.mjs';
import { threadBase } from './thread-base.mjs';

const isWorktree = (word, workspace) => isWorktreeName(word) && existsSync(worktreePathFor(word, workspace));

const standingIn = () => {
  try {
    return resolveWorktreeName([]);
  } catch {
    return null;
  }
};

const resolveRequest = (positional, workspace) => {
  const [first, second] = positional;
  if (second !== undefined) return { name: first, next: second };
  if (first === undefined) return { name: resolveWorktreeName([]), next: null };
  if (isWorktree(first, workspace)) return { name: first, next: null };
  const current = standingIn();
  if (!current) throw new Error(`No worktree named "${first}". Name the worktree before the new base, or run this from inside one.`);
  return { name: current, next: first };
};

const changeBase = ({ branch, next, name, ctx }) => {
  const { rootDir: main, workspace, log } = ctx;
  tryGit(['fetch', 'origin', threadBase.branchName(next), '--quiet'], main);
  const base = threadBase.assertBase(next, main);
  threadBase.storeBase({ branch, base, cwd: main, workspace });
  const open = threadBase.openPrBase(branch, main);
  if (open && open !== base) log(`The open PR still targets ${open}. Move it with: gh pr edit ${branch} --base ${base}`);
  log(`Rebase onto the new base with: ${workspace.name} worktree refresh ${name} --rebase`);
};

const reportBase = ({ branch, name, ctx }) => {
  const { base, stored } = threadBase.baseOf(branch, ctx.rootDir, ctx.workspace);
  const where = stored ? `stored in git config ${threadBase.configKey(branch)}` : 'the workspace base, nothing stored';
  ctx.log(`"${name}" (${branch}) is based on ${base}: ${where}.`);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const baseVerb = {
  usage: '  brock worktree base [name] [<new base>]',
  run: async (positional, options, ctx) => {
    const { name, next } = resolveRequest(positional, ctx.workspace);
    const path = worktreePathFor(name, ctx.workspace);
    if (!existsSync(path)) throw new Error(`No worktree at ${path}.`);
    const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], path);
    if (branch === 'HEAD') throw new Error(`"${name}" is on a detached HEAD, which has no base. Check out a branch first.`);
    if (next) changeBase({ branch, next, name, ctx });
    reportBase({ branch, name, ctx });
  },
};

export { baseVerb };
