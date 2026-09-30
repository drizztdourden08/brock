/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { userDataStep } from '../provision/user-data.mjs';
import { ensurePortSlot } from '../ports/ensure-port-slot.mjs';
import { assertName, MAIN_CHECKOUT } from '../worktree/paths.mjs';
import { createWorktreeContext } from '../worktree/worktree-context.mjs';

const provisionMain = async (worktree, ctx) => {
  if (existsSync(worktree.userData)) return;
  ctx.log(`First launch of the main checkout: provisioning ${worktree.userData}`);
  for (const step of [userDataStep(), ...ctx.provision]) await step.run(worktree);
};

/**
 * @param {string} name a worktree name, or `main` for the main checkout
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<import('../workspace/workspace.type.mjs').WorktreeContext>}
 */
const launchContext = async (name, ctx) => {
  if (name !== MAIN_CHECKOUT) {
    const worktree = createWorktreeContext(assertName(name), ctx);
    if (existsSync(worktree.path)) ensurePortSlot(worktree);
    return worktree;
  }
  const worktree = {
    name,
    path: ctx.rootDir,
    main: ctx.rootDir,
    userData: join(ctx.rootDir, '.user-data'),
    workspace: ctx.workspace,
    log: ctx.log,
    options: {},
  };
  await provisionMain(worktree, ctx);
  return worktree;
};

export { launchContext };
