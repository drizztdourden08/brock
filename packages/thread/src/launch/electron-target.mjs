/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, normalize, resolve } from 'node:path';
import { automationFlags } from './automation-flags.mjs';
import { buildIfStale } from './build-if-stale.mjs';
import { DIST_MAIN, distProblem } from './dist-problem.mjs';
import { ensureElectronBinary } from './electron-binary.mjs';
import { ensureAppIcons } from './ensure-app-icons.mjs';
import { ensureAppSynced } from './ensure-app-synced.mjs';
import { reviewDataDir } from './review-data.mjs';

const requireFrom = (dir) => createRequire(join(dir, 'package.json'));

const electronViteBin = (appDir) => {
  const manifest = requireFrom(appDir).resolve('electron-vite/package.json');
  const { bin } = JSON.parse(readFileSync(manifest, 'utf8'));
  return join(dirname(manifest), typeof bin === 'string' ? bin : bin['electron-vite']);
};

/**
 * @callback StatesHook
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {string} state
 * @returns {string[] | string | null} app flags, a refusal message, or null
 */

const stateFlags = (states, worktree, state) => {
  if (state === 'none') return [];
  if (!states) return [`--state=${state}`];
  const result = states(worktree, state);
  return Array.isArray(result) ? result : [];
};

const checkStateWith = (states) => (worktree, state) => {
  if (state === 'none' || !states) return null;
  const result = states(worktree, state);
  if (Array.isArray(result)) return null;
  return typeof result === 'string' ? result : `"${state}" is not a state "${worktree.name}" knows.`;
};

const appArgs = ({ worktree, state, visible, sound, passthrough }, userDataDir, states) => [
  `--user-data=${userDataDir}`,
  ...automationFlags({ visible, sound }),
  ...(worktree.path === worktree.main ? [] : [`--instance=${worktree.name}`]),
  ...stateFlags(states, worktree, state),
  ...passthrough,
];

const startDev = (appDir, args, log) => {
  ensureElectronBinary(appDir, log);
  log(`${appDir}> electron-vite dev --watch -- ${args.join(' ')}`);
  return spawn(process.execPath, [electronViteBin(appDir), 'dev', '--watch', '--', ...args], { cwd: appDir, stdio: 'inherit' });
};

const mainEntryOf = (appDir) => {
  try {
    const { main } = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
    return typeof main === 'string' ? normalize(main) : null;
  } catch {
    return null;
  }
};

const startProd = (appDir, args, log) => {
  const electron = ensureElectronBinary(appDir, log);
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  const entry = mainEntryOf(appDir) === DIST_MAIN ? '.' : DIST_MAIN;
  log(`${appDir}> electron ${entry} ${args.join(' ')}`);
  return spawn(electron, [entry, ...args], { cwd: appDir, stdio: 'inherit', env });
};

const notReadyWith = (dirs, userData) => (worktree, prod) => {
  if (!existsSync(dirs.userData(worktree))) {
    return `"${worktree.name}" has no ${userData} folder. Run: ${worktree.workspace.name} worktree create ${worktree.name}`;
  }
  const problem = prod ? (buildIfStale(dirs.app(worktree)) ?? distProblem(dirs.app(worktree))) : null;
  if (problem) return `"${worktree.name}" has no complete production build (${problem}). Build it first, or launch without --prod.`;
  return null;
};

/**
 * @param {{ app?: string, userData?: string, states?: StatesHook | null }} [options]
 * @returns {import('../workspace/workspace.type.mjs').LaunchTarget}
 */
const electronTarget = ({ app = '.', userData = '.user-data', states = null } = {}) => {
  const dirs = {
    app: (worktree) => resolve(worktree.path, app),
    userData: (worktree) => resolve(worktree.path, userData),
  };
  const launch = (request) => {
    const { worktree, prod } = request;
    const args = appArgs(request, reviewDataDir(request.passthrough, dirs.userData(worktree)), states);
    const appDir = dirs.app(worktree);
    ensureAppSynced(appDir, worktree.log);
    ensureAppIcons(appDir, worktree.log);
    return Promise.resolve(prod ? startProd(appDir, args, worktree.log) : startDev(appDir, args, worktree.log));
  };
  return { kind: 'electron', launch, appDir: dirs.app, notReady: notReadyWith(dirs, userData), checkState: checkStateWith(states) };
};

export { electronTarget };
