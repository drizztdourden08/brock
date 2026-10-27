/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildIfStale } from './build-if-stale.mjs';
import { launchSynced } from './ensure-app-synced.mjs';
import { notReadyWith, targetDirs } from './launch-readiness.mjs';
import { brockBin } from './run-brock.mjs';
import { checkStateWith, stateFlags } from './state-hooks.mjs';

const DIST_SERVER = join('dist', 'server', 'main.mjs');

const pipeOutput = (child) => {
  child.stdout.on('data', (chunk) => process.stdout.write(chunk));
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  return child;
};

const spawnPiped = (args, cwd) => pipeOutput(spawn(process.execPath, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }));

const appArgs = ({ worktree, state, passthrough }, userDataDir, states) => [`--user-data=${userDataDir}`, ...stateFlags(states, worktree, state), ...passthrough];

const startDev = (appDir, args, log) => {
  const bin = brockBin(appDir);
  if (!bin) throw new Error(`"${appDir}" has no @drizztdourden08/brock-build to run brock server dev. Run pnpm install.`);
  log(`${appDir}> brock server dev -- ${args.join(' ')}`);
  return spawnPiped([bin, 'server', 'dev', '--', ...args], appDir);
};

const startProd = (appDir, args, log) => {
  log(`${appDir}> node ${DIST_SERVER} ${args.join(' ')}`);
  return spawnPiped([DIST_SERVER, ...args], appDir);
};

const stateRefusal = (states) => (worktree, state) => {
  if (state === 'none' || states) return checkStateWith(states)(worktree, state);
  return `"${state}" is not a state: "${worktree.name}" declares no states for its server. Launch it with none.`;
};

const productionProblem = (appDir) => buildIfStale(appDir) ?? (existsSync(join(appDir, DIST_SERVER)) ? null : `${DIST_SERVER} is missing`);

/**
 * @param {{ app?: string, userData?: string, states?: import('./state-hooks.mjs').StatesHook | null }} [options]
 * @returns {import('../workspace/workspace.type.mjs').LaunchTarget}
 */
const serverTarget = ({ app = '.', userData = '.user-data', states = null } = {}) => {
  const dirs = targetDirs(app, userData);
  const launch = async (request) => {
    const { worktree, prod } = request;
    const args = appArgs(request, dirs.userData(worktree), states);
    const appDir = dirs.app(worktree);
    return launchSynced(appDir, worktree.log, () => prod ? startProd(appDir, args, worktree.log) : startDev(appDir, args, worktree.log));
  };
  return { kind: 'server', launch, appDir: dirs.app, notReady: notReadyWith(dirs, userData, productionProblem), checkState: stateRefusal(states) };
};

export { serverTarget };
