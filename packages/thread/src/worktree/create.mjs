/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { flag } from '../cli/thread-args.mjs';
import { tryGit } from '../git.mjs';
import { assertName } from './paths.mjs';
import { qualifyName } from './qualify-name.mjs';
import { addWorktree } from './add-worktree.mjs';
import { lockClone } from './clone-lock.mjs';
import { installDependencies } from './install.mjs';
import { cloneArtefacts } from './clone/clone-artefacts.mjs';
import { threadBase } from './thread-base.mjs';
import { createWorktreeContext } from './worktree-context.mjs';
import { userDataStep } from '../provision/user-data.mjs';
import { portSlotStep } from '../ports/port-slot-step.mjs';
import { startPrewarm } from '../launch/prewarm.mjs';

const runProvision = async (worktree, ctx) => {
  for (const step of [userDataStep(), portSlotStep(), ...ctx.provision]) {
    ctx.log(`Provision: ${step.name}`);
    await step.run(worktree);
  }
};

const electronAppDirs = (worktree, ctx) => [...new Set(Object.values(ctx.targets).filter((target) => target.kind === 'electron').map((target) => target.appDir(worktree)))];

const prewarmApps = (worktree, ctx) => {
  for (const dir of electronAppDirs(worktree, ctx)) startPrewarm(dir, ctx.log);
};

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {{ source: string } | null} cloned where node_modules came from
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {boolean} true when the build records came over too
 */
const cloneOutputs = (worktree, cloned, ctx) => {
  if (!cloned) return false;
  const appDirs = Object.values(ctx.targets).map((target) => target.appDir?.(worktree)).filter(Boolean);
  const copied = cloneArtefacts({ source: cloned.source, target: worktree.path, appDirs });
  const tree = copied.sameTree ? `${copied.outputs} generated output(s) as well, the tree matches` : 'generated outputs left to the first launch, the tree differs';
  ctx.log(`Build records: ${copied.keyed} copied from ${cloned.source}; ${tree}.`);
  return copied.keyed > 0;
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
  usage: '  brock worktree create <name> [--prefix <text>] [--from <ref>] [--base <branch>] [--skip-install | --no-clone]',
  run: async (positional, options, ctx) => {
    const name = qualifyName(positional[0], ctx.workspace, options, { create: true });
    assertName(name);
    const worktree = createWorktreeContext(name, ctx, options);
    const from = typeof options.from === 'string' ? options.from : null;
    const asked = typeof options.base === 'string' ? threadBase.branchName(options.base) : null;
    let how = 'existing';
    if (existsSync(worktree.path)) ctx.log(`${worktree.path} already exists; provisioning only.`);
    else how = addWorktree({ name, path: worktree.path, from, base: asked, ctx });
    recordBase({ worktree, how, from, asked, ctx });
    const cloned = await installDependencies(worktree, options, ctx);
    if (cloned) lockClone(worktree.path, ctx.rootDir, ctx.log);
    const warm = cloneOutputs(worktree, cloned, ctx);
    await runProvision(worktree, ctx);
    if (!flag(options, 'skip-install') && !warm) prewarmApps(worktree, ctx);
    ctx.log(`"${name}" is ready.`);
    ctx.log(`Worktree: ${worktree.path}`);
    ctx.log(`Launch: ${ctx.workspace.name} worktree launch ${name} none [--visible]`);
  },
};

export { createVerb };
