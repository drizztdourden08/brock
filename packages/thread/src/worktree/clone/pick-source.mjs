/* @layer tooling-scripts @kind logic */
import { readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { registeredWorktrees } from '../paths.mjs';
import { LOCKFILE, MODULES_STATE } from './clone.constants.mjs';
import { modulesState } from './modules-state.mjs';

const readLockfile = (dir) => {
  try {
    return readFileSync(join(dir, LOCKFILE));
  } catch {
    return null;
  }
};

const installedAt = (dir) => statSync(join(dir, 'node_modules', MODULES_STATE), { throwIfNoEntry: false })?.mtimeMs ?? 0;

/**
 * @typedef {object} CloneSource
 * @property {string} dir the checkout to copy from
 * @property {import('./modules-state.mjs').ModulesState} state what pnpm installed there
 */

/**
 * The checkout a new worktree clones from: the main checkout when its install matches the new lockfile byte for byte,
 * else the newest sibling worktree that does.
 * @param {{ target: string, main: string, worktrees?: string[] }} input
 * @returns {{ source: CloneSource | null, reason: string }} the source, or why there is none
 */
const pickSource = ({ target, main, worktrees = registeredWorktrees(main) }) => {
  const wanted = readLockfile(target);
  if (!wanted) return { source: null, reason: `no ${LOCKFILE} in the new worktree` };
  const usable = (dir) => resolve(dir) !== resolve(target);
  const matches = (dir) => ({ dir, state: modulesState(dir) });
  const mainState = usable(main) ? matches(main) : null;
  if (mainState?.state?.lockfile.equals(wanted)) return { source: mainState, reason: '' };
  const siblings = worktrees
    .filter((dir) => usable(dir) && resolve(dir) !== resolve(main))
    .sort((a, b) => installedAt(b) - installedAt(a));
  for (const dir of siblings) {
    const found = matches(dir);
    if (found.state?.lockfile.equals(wanted)) return { source: found, reason: '' };
  }
  return { source: null, reason: 'no checkout has an install of this exact lockfile' };
};

export { pickSource };
