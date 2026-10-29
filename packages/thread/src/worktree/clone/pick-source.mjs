/* @layer tooling-scripts @kind logic */
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tryGit } from '../../git.mjs';
import { registeredWorktrees } from '../paths.mjs';
import { INSTALL_INPUTS, LOCKFILE, MODULES_STATE, STORE_RECORD } from './clone.constants.mjs';
import { lockfileImporters } from './lockfile-importers.mjs';
import { modulesState } from './modules-state.mjs';
import { isInside } from './path-map.mjs';
import { entryOf } from './store-entry.mjs';

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

const localOnly = (dir, name, target) => existsSync(join(dir, name)) && !existsSync(join(target, name)) && tryGit(['check-ignore', '-q', name], dir) !== null;

/**
 * @param {string} dir the source checkout
 * @param {string} target the new worktree
 * @returns {string[]} install inputs kept out of git
 */
const localInputs = (dir, target) => INSTALL_INPUTS.filter((name) => localOnly(dir, name, target));

const installedAt = (dir) => statSync(join(dir, 'node_modules', MODULES_STATE), { throwIfNoEntry: false })?.mtimeMs ?? 0;

/**
 * @param {string} dir a checkout whose install rewrote its lockfile
 * @param {Buffer} wanted the new worktree's lockfile
 * @param {string} target the new worktree
 * @returns {boolean} true when commit and install inputs match
 */
const sameCommittedInstall = (dir, wanted, target) => {
  const committed = tryGit(['show', `HEAD:${LOCKFILE}`], dir);
  if (committed === null || !sameLines(Buffer.from(`${committed}\n`)).equals(wanted)) return false;
  return INSTALL_INPUTS.every((name) => sameFile(join(dir, name), join(target, name)) || localOnly(dir, name, target));
};

/**
 * @param {{ dir: string, state: import('./modules-state.mjs').ModulesState | null }} found
 * @param {Buffer} wanted the new worktree's lockfile
 * @param {string} target the new worktree
 * @returns {boolean} true when both install the same packages
 */
const installsTheSame = ({ dir, state }, wanted, target) => {
  if (!state) return false;
  const installed = sameLines(state.lockfile);
  if (installed.equals(wanted)) return true;
  const working = readLines(join(dir, LOCKFILE)) ?? Buffer.alloc(0);
  return (working.equals(installed) || working.equals(wanted)) && sameCommittedInstall(dir, wanted, target);
};

const isLink = (path) => {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
};

const realOrNull = (path) => {
  try {
    return realpathSync.native(path);
  } catch {
    return null;
  }
};

/**
 * @param {{ dir: string, state: import('./modules-state.mjs').ModulesState }} found
 * @returns {boolean} true when no node_modules is a link and packages are its own
 */
const ownsInstall = ({ dir, state }) => {
  const importers = ['.', ...lockfileImporters(state.lockfile.toString('utf8'))];
  if (importers.some((rel) => isLink(join(dir, rel, 'node_modules')))) return false;
  const real = realOrNull(state.virtualStore);
  const home = realOrNull(dir);
  if (!real || !home) return false;
  return isInside(home, real) || existsSync(join(entryOf(state.virtualStore), STORE_RECORD));
};

/**
 * @typedef {object} CloneSource
 * @property {string} dir the checkout to copy from
 * @property {import('./modules-state.mjs').ModulesState} state what pnpm installed there
 * @property {string[]} local ignored install inputs to copy along
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
    if (installsTheSame(found, wanted, target) && ownsInstall(found)) return { source: { ...found, local: localInputs(dir, target) }, reason: '' };
  }
  return { source: null, reason: 'no checkout has an install of this exact lockfile' };
};

export { pickSource };
