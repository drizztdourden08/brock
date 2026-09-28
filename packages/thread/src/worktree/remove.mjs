/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { gitLoud } from '../git.mjs';
import { guards } from './guards.mjs';
import { findLinks } from './find-links.mjs';
import { registeredWorktrees } from './paths.mjs';
import { assertReleasable } from './release-checks.mjs';
import { clearUserData } from './clear-user-data.mjs';
import { settleBranch } from './settle-branch.mjs';
import { createWorktreeContext } from './worktree-context.mjs';

const normalized = (path) => resolve(path).replace(/\\/g, '/').toLowerCase();

const isRemnant = (worktreePath, main) => !registeredWorktrees(main).some((path) => normalized(path) === normalized(worktreePath));

const removeRemnant = (worktree) => {
  const { path, main, log } = worktree;
  const links = findLinks(path);
  if (links.length > 0) throw new Error(`Refusing: ${links.length} link(s) inside the remnant (${links.slice(0, 5).join(', ')}).`);
  log('Unregistered remnant (a previous remove failed mid-delete); deleting the directory.');
  rmSync(path, { recursive: true, force: true });
  gitLoud(['worktree', 'prune'], main);
  log(`Remnant "${worktree.name}" deleted. Its branch (if any) was left alone; review with git branch.`);
};

const removeRegistered = async (worktree, ctx) => {
  const { name, path, main, log } = worktree;
  const { branch, landed } = assertReleasable(worktree, ctx, 'remove');
  if (await clearUserData(worktree, ctx)) log('.user-data deleted.');
  log(`Removing worktree at ${path}.`);
  gitLoud(['worktree', 'remove', path], main);
  log(`"${name}" removed.`);
  settleBranch({ name, branch, landed, ctx });
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const removeVerb = {
  usage: '  brock worktree remove <name>',
  run: async (positional, options, ctx) => {
    const [name] = positional;
    if (!name) throw new Error(`Usage:\n${removeVerb.usage}`);
    const worktree = createWorktreeContext(name, ctx);
    if (!existsSync(worktree.path)) throw new Error(`No worktree at ${worktree.path}.`);
    guards.assertNotProtected(worktree.path, worktree.main);
    guards.assertNotInside(worktree.path, ctx.workspace.name);
    guards.assertNotRunning(name);
    if (isRemnant(worktree.path, worktree.main)) removeRemnant(worktree);
    else await removeRegistered(worktree, ctx);
  },
};

export { removeVerb };
