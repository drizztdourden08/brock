/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { gitLoud } from '../git.mjs';
import { flag } from '../cli/thread-args.mjs';
import { guards } from './guards.mjs';
import { clearUserData } from './clear-user-data.mjs';
import { createWorktreeContext } from './worktree-context.mjs';

const rebaseTarget = (options, base) => {
  if (options.rebase === undefined) return null;
  return typeof options.rebase === 'string' && options.rebase !== 'true' ? options.rebase : `origin/${base}`;
};

const rebase = (worktreePath, onto, log) => {
  log('Fetching origin.');
  gitLoud(['fetch', 'origin'], worktreePath);
  log(`Rebasing onto ${onto}.`);
  try {
    gitLoud(['rebase', onto], worktreePath);
  } catch {
    gitLoud(['rebase', '--abort'], worktreePath);
    throw new Error(`Rebase onto ${onto} did not apply, so it was aborted. The branch is unchanged. Resolve it by hand, or refresh without --rebase.`);
  }
};

const resetUserData = async (worktree, ctx) => {
  const cleared = await clearUserData(worktree, ctx);
  ctx.log(cleared ? '.user-data removed; the next provision starts fresh.' : '.user-data already absent; nothing to reset.');
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const refreshVerb = {
  usage: '  brock worktree refresh <name> [--reset] [--rebase [ref]]',
  run: async (positional, options, ctx) => {
    const [name] = positional;
    if (!name) throw new Error(`Usage:\n${refreshVerb.usage}`);
    const worktree = createWorktreeContext(name, ctx);
    if (!existsSync(worktree.path)) throw new Error(`No worktree at ${worktree.path}. Run: ${ctx.workspace.name} worktree create ${name}`);
    guards.assertClean(worktree.path, 'refresh');
    const onto = rebaseTarget(options, ctx.workspace.base);
    if (onto) rebase(worktree.path, onto, ctx.log);
    else ctx.log('Branch left where it is (pass --rebase [ref] to move it).');
    if (flag(options, 'reset')) await resetUserData(worktree, ctx);
    for (const step of ctx.provision) {
      ctx.log(`Provision: ${step.name}`);
      await step.run(worktree);
    }
    ctx.log(`"${name}" refreshed.`);
  },
};

export { refreshVerb };
