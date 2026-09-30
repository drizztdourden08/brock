/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONFIG_FILE } from '../config.mjs';
import { appDirs } from './app-dirs.mjs';
import { electronAppDirs } from './electron-app-dirs.mjs';

const WORKSPACE_FILE = 'brock.workspace.mjs';

const workspaceTargets = async (rootDir) => {
  const file = join(rootDir, WORKSPACE_FILE);
  if (!existsSync(file)) return [];
  const workspace = (await import(pathToFileURL(file).href)).default ?? {};
  return electronAppDirs(workspace, rootDir);
};

/**
 * @param {string} rootDir an app root, or a repo root with brock.workspace.mjs
 * @returns {Promise<string[]>} the app roots to sync or check
 */
const syncTargets = async (rootDir) => {
  if (existsSync(join(rootDir, CONFIG_FILE))) return [rootDir];
  const hasConfig = (dir) => existsSync(join(dir, CONFIG_FILE));
  const fromWorkspace = (await workspaceTargets(rootDir)).filter(hasConfig);
  if (fromWorkspace.length) return fromWorkspace;
  return appDirs(rootDir).map((dir) => resolve(rootDir, dir));
};

export { syncTargets };
