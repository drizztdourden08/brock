/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { hasTessera } from './has-tessera.mjs';
import { TESSERA_CONFIG_FILE } from './tessera.constants.mjs';

const inside = (dir, folder) => {
  const path = relative(folder, dir);
  return path === '' || (!path.startsWith('..') && !isAbsolute(path));
};

const appFoldersOf = (configDir) => {
  try {
    const apps = JSON.parse(readFileSync(join(configDir, TESSERA_CONFIG_FILE), 'utf8'))?.apps;
    return Object.keys(apps ?? {}).map((app) => resolve(configDir, app));
  } catch {
    return [];
  }
};

/**
 * @param {string} configDir  the folder of tessera.config.json
 * @returns {string[]}  the folders tessera guide runs in
 */
const guideRunDirs = (configDir) => {
  if (hasTessera(configDir)) return [configDir];
  const apps = appFoldersOf(configDir);
  const packages = workspaceDirs(configDir).map((dir) => resolve(dir)).sort();
  const shared = packages.filter((dir) => !apps.some((app) => inside(dir, app))).find(hasTessera);
  if (shared) return [shared];
  const appRuns = apps.filter((app) => packages.includes(app) && hasTessera(app));
  return appRuns.length > 0 ? appRuns : [configDir];
};

export { guideRunDirs };
