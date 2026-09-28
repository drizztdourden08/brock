/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { assertName } from './paths.mjs';
import { addWorktree } from './add-worktree.mjs';
import { installDependencies } from './install.mjs';
import { createWorktreeContext } from './worktree-context.mjs';
import { userDataStep } from '../provision/user-data.mjs';

const runProvision = async (worktree, ctx) => {
  for (const step of [userDataStep(), ...ctx.provision]) {
    ctx.log(`Provision: ${step.name}`);
    await step.run(worktree);
  }
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const createVerb = {
  usage: '  brock worktree create <name> [--from <ref>] [--skip-install]',
  run: async (positional, options, ctx) => {
    const [name] = positional;
    assertName(name);
    const worktree = createWorktreeContext(name, ctx, options);
    const from = typeof options.from === 'string' ? options.from : null;
    if (existsSync(worktree.path)) ctx.log(`${worktree.path} already exists; provisioning only.`);
    else addWorktree({ name, path: worktree.path, from, ctx });
    installDependencies(worktree, options, ctx);
    await runProvision(worktree, ctx);
    ctx.log(`"${name}" is ready.`);
    ctx.log(`Worktree: ${worktree.path}`);
    ctx.log(`Launch: ${ctx.workspace.name} worktree launch ${name} none [--visible]`);
  },
};

export { createVerb };
