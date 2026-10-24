/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { CONFIG_FILE } from './config.mjs';
import { syncTargets } from './commands/sync-targets.mjs';

const WORKSPACE_MARKERS = ['pnpm-workspace.yaml', 'brock.workspace.mjs'];

const isCheckoutRoot = (dir) => existsSync(join(dir, '.git'));

const hasConfig = (dir) => existsSync(join(dir, CONFIG_FILE));

/**
 * @param {string} start
 * @param {(dir: string) => boolean} test
 * @returns {string | null} the nearest match, never past a git checkout
 */
const walkUp = (start, test) => {
  let current = start;
  for (;;) {
    if (test(current)) return current;
    const parent = dirname(current);
    if (parent === current || isCheckoutRoot(current)) return null;
    current = parent;
  }
};

const isWorkspaceRoot = (dir) => WORKSPACE_MARKERS.some((name) => existsSync(join(dir, name)));

const listing = (workspaceRoot, apps) => apps.map((dir) => `  ${relative(workspaceRoot, dir).replace(/\\/g, '/') || '.'}`).join('\n');

/**
 * @param {string} start
 * @param {string} app the `--app` value
 * @returns {string}
 */
const chosenApp = (start, app) => {
  const workspaceRoot = walkUp(start, isWorkspaceRoot);
  const candidates = [resolve(start, app), ...(workspaceRoot ? [resolve(workspaceRoot, app)] : [])];
  const found = candidates.find(hasConfig);
  if (!found) throw new Error(`--app ${app}: no ${CONFIG_FILE} in ${candidates.join(' or ')}`);
  return found;
};

/**
 * @param {string} start
 * @returns {Promise<string>}
 */
const onlyAppOf = async (start) => {
  const workspaceRoot = walkUp(start, isWorkspaceRoot);
  if (!workspaceRoot) throw new Error(`No ${CONFIG_FILE} in ${start} or any folder above it, and it is not inside a workspace.`);
  const apps = await syncTargets(workspaceRoot);
  if (apps.length === 1) return apps[0];
  if (!apps.length) throw new Error(`No ${CONFIG_FILE} in ${start} or above it, and the workspace ${workspaceRoot} has no app with one.`);
  throw new Error(`The workspace ${workspaceRoot} has ${apps.length} apps. Run from inside one, or pass --app <dir>:\n${listing(workspaceRoot, apps)}`);
};

/**
 * @param {string} start the folder the command runs from
 * @param {string | undefined} app the `--app` value
 * @returns {Promise<string>} the app folder to run in
 */
const resolveAppDir = async (start, app) => {
  if (app) return chosenApp(start, app);
  return walkUp(start, hasConfig) ?? onlyAppOf(start);
};

export { resolveAppDir };
