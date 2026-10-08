/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { tryGit } from '../git.mjs';
import { assertName } from './paths.mjs';
import { addWorktree } from './add-worktree.mjs';
import { installDependencies } from './install.mjs';
import { threadBase } from './thread-base.mjs';
import { createWorktreeContext } from './worktree-context.mjs';
import { userDataStep } from '../provision/user-data.mjs';
import { portSlotStep } from '../ports/port-slot-step.mjs';

const runProvision = async (worktree, ctx) => {
  for (const step of [userDataStep(), portSlotStep(), ...ctx.provision]) {
    ctx.log(`Provision: ${step.name}`);
    await step.run(worktree);
  }
};

const recoveredBase = (branch, main) => (threadBase.storedBase(branch, main) ? null : threadBase.openPrBase(branch, main));

const baseToStore = ({ how, from, asked, branch, main }) => {
  if (asked) return threadBase.assertBase(asked, main);
  if (how === 'cut') return threadBase.remoteBranchOf(from, main);
  return recoveredBase(branch, main);
};

const recordBase = ({ worktree, how, from, asked, ctx }) => {
  const { rootDir: main, workspace, log } = ctx;
  const branch = tryGit(['rev-parse', '--abbrev-ref', 'HEAD'], worktree.path);
  if (!branch || branch === 'HEAD') return;
  const base = baseToStore({ how, from, asked, branch, main });
  if (base) threadBase.storeBase({ branch, base, cwd: main, workspace });
  const { base: now, stored } = threadBase.baseOf(branch, main, workspace);
  log(stored ? `Base: ${now}, stored in git config ${threadBase.configKey(branch)}.` : `Base: ${now}, the workspace base.`);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const createVerb = {
  usage: '  brock worktree create <name> [--from <ref>] [--base <branch>] [--skip-install]',
  run: async (positional, options, ctx) => {
    const [name] = positional;
    assertName(name);
    const worktree = createWorktreeContext(name, ctx, options);
    const from = typeof options.from === 'string' ? options.from : null;
    const asked = typeof options.base === 'string' ? threadBase.branchName(options.base) : null;
    let how = 'existing';
    if (existsSync(worktree.path)) ctx.log(`${worktree.path} already exists; provisioning only.`);
    else how = addWorktree({ name, path: worktree.path, from, base: asked, ctx });
    recordBase({ worktree, how, from, asked, ctx });
    installDependencies(worktree, options, ctx);
    await runProvision(worktree, ctx);
    ctx.log(`"${name}" is ready.`);
    ctx.log(`Worktree: ${worktree.path}`);
    ctx.log(`Launch: ${ctx.workspace.name} worktree launch ${name} none [--visible]`);
  },
};

export { createVerb };
