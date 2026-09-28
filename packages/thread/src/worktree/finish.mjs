/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { gitLoud, tryGit } from '../git.mjs';
import { resolveWorktreeName } from './current.mjs';
import { assertReleasable } from './release-checks.mjs';
import { clearUserData } from './clear-user-data.mjs';
import { settleBranch } from './settle-branch.mjs';
import { createWorktreeContext } from './worktree-context.mjs';

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

const reportSurvivor = ({ gone, inside, worktree, alias }) => {
  const { name, path, main, log } = worktree;
  if (!gone) {
    log(`The directory survived: something still holds ${path} open, most likely this session's own shell sitting in it. It is unregistered, so nothing uses it now.`);
    log(`Finish it with one call from anywhere else: ${alias} worktree remove ${name}`);
  }
  if (inside) log(`That worktree was your working directory. cd ${main} now.`);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const finishVerb = {
  usage: '  brock worktree finish [name]',
  run: async (positional, options, ctx) => {
    const name = resolveWorktreeName(positional);
    const worktree = createWorktreeContext(name, ctx);
    const { path, main, log } = worktree;
    if (!existsSync(path)) throw new Error(`No worktree at ${path}.`);
    const { branch, landed } = assertReleasable(worktree, ctx, 'finish');
    const inside = resolve(path) === resolve(process.cwd());
    if (inside) process.chdir(main);
    if (await clearUserData(worktree, ctx)) log('.user-data deleted.');
    log(`Removing worktree at ${path}.`);
    const gone = removeTree(path, main, log);
    log(`"${name}" finished.`);
    settleBranch({ name, branch, landed, ctx });
    reportSurvivor({ gone, inside, worktree, alias: ctx.workspace.name });
  },
};

export { finishVerb };
