/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { LONG_PATHS, tryGit } from '../git.mjs';
import { deleteTree } from './delete-tree.mjs';
import { registeredWorktrees } from './paths.mjs';
import { samePath } from './same-path.mjs';

const isPathArgument = (argument) => isAbsolute(argument) || /[\\/]/.test(argument);

const isBelow = (folder, path) => {
  const rel = relative(folder, path);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
};

const assertLeftover = ({ path, folder, main }) => {
  if (!isBelow(folder, path)) throw new Error(`Refusing ${path}: it is not inside the worktrees folder ${folder}.`);
  if (!existsSync(path)) throw new Error(`No folder at ${path}.`);
  if (registeredWorktrees(main).some((registered) => samePath(registered, path))) {
    throw new Error(`${path} is a registered worktree. Remove it by name: worktree remove ${path.split(/[\\/]/).pop()}`);
  }
  const cwd = resolve(process.cwd());
  if (samePath(path, cwd) || isBelow(path, cwd)) throw new Error(`Refusing ${path}: this session is running inside it. cd elsewhere and run it again.`);
};

/**
 * @param {string} argument a folder under the worktrees folder
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<void>}
 */
const removeLeftover = async (argument, ctx) => {
  const { rootDir: main, workspace, log } = ctx;
  const folder = resolve(main, workspace.worktreesDir);
  const path = resolve(argument);
  assertLeftover({ path, folder, main });
  log(`${path} is not a registered worktree; deleting the folder.`);
  const failure = await deleteTree(folder, path);
  if (failure) throw new Error(`Could not delete ${failure.path} (${failure.code}); something holds it open. Close it and run the same remove again.`);
  tryGit([...LONG_PATHS, 'worktree', 'prune'], main);
  log('Folder deleted. No branch was touched; review with git branch.');
};

export { isPathArgument, removeLeftover };
