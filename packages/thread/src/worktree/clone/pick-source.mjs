/* @layer tooling-scripts @kind logic */
import { readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tryGit } from '../../git.mjs';
import { registeredWorktrees } from '../paths.mjs';
import { INSTALL_INPUTS, LOCKFILE, MODULES_STATE } from './clone.constants.mjs';
import { modulesState } from './modules-state.mjs';

const sameLines = (bytes) => Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));

const readLines = (file) => {
  try {
    return sameLines(readFileSync(file));
  } catch {
    return null;
  }
};

const sameFile = (one, two) => {
  const [a, b] = [readLines(one), readLines(two)];
  return a === null ? b === null : b !== null && a.equals(b);
};

const installedAt = (dir) => statSync(join(dir, 'node_modules', MODULES_STATE), { throwIfNoEntry: false })?.mtimeMs ?? 0;

/**
 * @param {string} dir a checkout whose lockfile was rewritten by its own install, as a pnpmfile or a drive link does
 * @param {Buffer} wanted the new worktree's lockfile
 * @param {string} target the new worktree
 * @returns {boolean} true when both commits hold that lockfile and the same install inputs
 */
const sameCommittedInstall = (dir, wanted, target) => {
  const committed = tryGit(['show', `HEAD:${LOCKFILE}`], dir);
  if (committed === null || !sameLines(Buffer.from(`${committed}\n`)).equals(wanted)) return false;
  return INSTALL_INPUTS.every((name) => sameFile(join(dir, name), join(target, name)));
};

/**
 * @param {{ dir: string, state: import('./modules-state.mjs').ModulesState | null }} found
 * @param {Buffer} wanted the new worktree's lockfile
 * @param {string} target the new worktree
 * @returns {boolean} true when the new worktree would install what that checkout has
 */
const installsTheSame = ({ dir, state }, wanted, target) => {
  if (!state) return false;
  const installed = sameLines(state.lockfile);
  if (installed.equals(wanted)) return true;
  return installed.equals(readLines(join(dir, LOCKFILE)) ?? Buffer.alloc(0)) && sameCommittedInstall(dir, wanted, target);
};

/**
 * @typedef {object} CloneSource
 * @property {string} dir the checkout to copy from
 * @property {import('./modules-state.mjs').ModulesState} state what pnpm installed there
 */

/**
 * @param {{ target: string, main: string, worktrees?: string[] }} input
 * @returns {{ source: CloneSource | null, reason: string }} the source, or why there is none
 */
const pickSource = ({ target, main, worktrees = registeredWorktrees(main) }) => {
  const wanted = readLines(join(target, LOCKFILE));
  if (!wanted) return { source: null, reason: `no ${LOCKFILE} in the new worktree` };
  const usable = (dir) => resolve(dir) !== resolve(target);
  const candidates = [
    ...(usable(main) ? [main] : []),
    ...worktrees.filter((dir) => usable(dir) && resolve(dir) !== resolve(main)).sort((a, b) => installedAt(b) - installedAt(a)),
  ];
  for (const dir of candidates) {
    const found = { dir, state: modulesState(dir) };
    if (installsTheSame(found, wanted, target)) return { source: found, reason: '' };
  }
  return { source: null, reason: 'no checkout has an install of this exact lockfile' };
};

export { pickSource };
