/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { gitLoud, LONG_PATHS } from '../git.mjs';
import { deleteTree } from './delete-tree.mjs';
import { guards } from './guards.mjs';
import { findLinks } from './find-links.mjs';
import { registeredWorktrees } from './paths.mjs';
import { assertReleasable } from './release-checks.mjs';
import { clearUserData } from './clear-user-data.mjs';
import { isPathArgument, removeLeftover } from './remove-leftover.mjs';
import { removeTree } from './remove-tree.mjs';
import { samePath } from './same-path.mjs';
import { settleBranch } from './settle-branch.mjs';
import { createWorktreeContext } from './worktree-context.mjs';
import { qualifyName } from './qualify-name.mjs';

const isRemnant = (worktreePath, main) => !registeredWorktrees(main).some((path) => samePath(path, worktreePath));

const removeRemnant = async (worktree) => {
  const { path, main, log } = worktree;
  const links = findLinks(path);
  if (links.length > 0) throw new Error(`Refusing: ${links.length} link(s) inside the remnant (${links.slice(0, 5).join(', ')}).`);
  log('Unregistered remnant (a previous remove failed mid-delete); deleting the directory.');
  const failure = await deleteTree(path, path);
  if (failure) throw new Error(`Could not delete ${failure.path} (${failure.code}); something holds it open. Close it and run the same remove again.`);
  gitLoud([...LONG_PATHS, 'worktree', 'prune'], main);
  log(`Remnant "${worktree.name}" deleted. Its branch (if any) was left alone; review with git branch.`);
};

const removeRegistered = async (worktree, ctx) => {
  const { name, path, main, log } = worktree;
  const { branch, base, landed } = assertReleasable(worktree, ctx, 'remove');
  if (await clearUserData(worktree, ctx)) log('.user-data deleted.');
  log(`Removing worktree at ${path}.`);
  if (await removeTree(path, main, log)) log(`"${name}" removed.`);
  else log(`"${name}" is unregistered but its directory survived; something still holds ${path} open. Run the same remove again once it is closed.`);
  settleBranch({ name, branch, base, landed, ctx });
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const removeVerb = {
  usage: '  brock worktree remove <name | path>',
  run: async (positional, options, ctx) => {
    if (positional[0] && isPathArgument(positional[0])) return removeLeftover(positional[0], ctx);
    const name = qualifyName(positional[0], ctx.workspace, options);
    if (!name) throw new Error(`Usage:\n${removeVerb.usage}`);
    const worktree = createWorktreeContext(name, ctx);
    if (!existsSync(worktree.path)) throw new Error(`No worktree at ${worktree.path}.`);
    guards.assertNotProtected(worktree.path, worktree.main);
    guards.assertNotInside(worktree.path, ctx.workspace.name);
    guards.assertNotRunning(name);
    if (isRemnant(worktree.path, worktree.main)) await removeRemnant(worktree);
    else await removeRegistered(worktree, ctx);
  },
};

export { removeVerb };
