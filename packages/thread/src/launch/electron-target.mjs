/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, normalize } from 'node:path';
import { automationFlags } from './automation-flags.mjs';
import { buildIfStale } from './build-if-stale.mjs';
import { DIST_MAIN, distProblem } from './dist-problem.mjs';
import { ensureElectronBinary } from './electron-binary.mjs';
import { ensureAppSynced } from './ensure-app-synced.mjs';
import { notReadyWith, targetDirs } from './launch-readiness.mjs';
import { reviewDataDir } from './review-data.mjs';
import { checkStateWith, stateFlags } from './state-hooks.mjs';

const requireFrom = (dir) => createRequire(join(dir, 'package.json'));

const electronViteBin = (appDir) => {
  const manifest = requireFrom(appDir).resolve('electron-vite/package.json');
  const { bin } = JSON.parse(readFileSync(manifest, 'utf8'));
  return join(dirname(manifest), typeof bin === 'string' ? bin : bin['electron-vite']);
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

const productionProblem = (appDir) => buildIfStale(appDir) ?? distProblem(appDir);

/**
 * @param {{ app?: string, userData?: string, states?: import('./state-hooks.mjs').StatesHook | null }} [options]
 * @returns {import('../workspace/workspace.type.mjs').LaunchTarget}
 */
const electronTarget = ({ app = '.', userData = '.user-data', states = null } = {}) => {
  const dirs = targetDirs(app, userData);
  const launch = (request) => {
    const { worktree, prod } = request;
    const args = appArgs(request, reviewDataDir(request.passthrough, dirs.userData(worktree)), states);
    const appDir = dirs.app(worktree);
    ensureAppSynced(appDir, worktree.log);
    return Promise.resolve(prod ? startProd(appDir, args, worktree.log) : startDev(appDir, args, worktree.log));
  };
  return { kind: 'electron', launch, appDir: dirs.app, notReady: notReadyWith(dirs, userData, productionProblem), checkState: checkStateWith(states) };
};

export { electronTarget };
