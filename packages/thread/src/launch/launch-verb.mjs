/* @layer tooling-scripts @kind logic */
import { flag } from '../cli/thread-args.mjs';
import { launchContext } from './launch-context.mjs';

const OWN_OPTIONS = new Set(['target', 'visible', 'sound', 'prod']);
const USAGE = 'launch <name|main> <state|none> [--target <key>] [--prod] [--visible [--sound]] [passthrough...]';

const passthroughOf = (options, extra) => [
  ...Object.entries(options)
    .filter(([key]) => !OWN_OPTIONS.has(key))
    .map(([key, value]) => (value === true ? `--${key}` : `--${key}=${value}`)),
  ...extra,
];

const pickTarget = (ctx, requested) => {
  const keys = Object.keys(ctx.targets);
  if (keys.length === 0) {
    throw new Error(`"${ctx.workspace.name}" declares no launch target. Add targets: { app: electronTarget() } to brock.workspace.mjs.`);
  }
  const key = typeof requested === 'string' ? requested : (Object.keys(ctx.workspace.targets)[0] ?? keys[0]);
  const target = ctx.targets[key];
  if (!target) throw new Error(`Unknown target "${key}". Targets: ${keys.join(', ')}.`);
  return target;
};

const runBuildSteps = async (ctx, worktree, needed) => {
  if (!needed) return;
  for (const step of ctx.build) {
    if (!step.isStale(worktree)) continue;
    ctx.log(`Building: ${step.name}`);
    await step.run(worktree);
  }
};

const afterLaunch = async (ctx, worktree) => {
  for (const step of ctx.provision) {
    if (!step.afterLaunch) continue;
    try {
      await step.afterLaunch(worktree);
    } catch (error) {
      ctx.log(`${step.name}: after-launch step failed: ${error.message}`);
    }
  }
};

const waitForClose = (child, onClose) =>
  new Promise((resolve) => {
    child.on('error', (error) => {
      onClose(`could not start: ${error.message}`).then(() => resolve(1));
    });
    child.on('close', (code) => {
      onClose(null).then(() => resolve(code ?? 0));
    });
  });

const run = async (positional, options, ctx) => {
  const [name, state, ...extra] = positional;
  if (!name || !state) throw new Error(`Usage: ${ctx.workspace.name} ${USAGE}`);
  const target = pickTarget(ctx, options.target);
  const prod = flag(options, 'prod');
  const worktree = await launchContext(name, ctx);
  const refusal = target.notReady?.(worktree, prod) ?? target.checkState?.(worktree, state) ?? null;
  if (refusal) throw new Error(refusal);
  await runBuildSteps(ctx, worktree, prod || target.kind !== 'electron');
  const child = await target.launch({
    worktree,
    state,
    visible: flag(options, 'visible'),
    sound: flag(options, 'sound'),
    prod,
    passthrough: passthroughOf(options, extra),
  });
  return waitForClose(child, async (failure) => {
    if (failure) ctx.log(failure);
    await afterLaunch(ctx, worktree);
  });
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const launchVerb = {
  usage: `  brock ${USAGE}\n      dev by default (hot reload, no bundle step); --prod runs the production build`,
  run,
};

export { launchVerb };
