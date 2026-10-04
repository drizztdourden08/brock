/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { appDirs } from './app-dirs.mjs';
import { brockInstallOf } from './brock-install.mjs';
import { tesseraBefore } from './tessera-before.mjs';

const labelOf = (rootDir, dir) => relative(rootDir, dir).replace(/\\/g, '/') || '.';

const pinOf = (dir) => {
  const pinned = brockInstallOf.packageOf(dir)?.brock?.version;
  return typeof pinned === 'string' ? pinned : null;
};

const appOf = (rootDir, plan, sourceDir) => (dir) => {
  const label = labelOf(rootDir, dir);
  const source = join(sourceDir, label);
  return { dir, label, from: pinOf(source) ?? plan.current, tesseraFrom: tesseraBefore(sourceDir, source) };
};

/**
 * @param {string} rootDir the upgrade worktree
 * @param {{ current: string | null }} plan
 * @param {string} [sourceDir] the main checkout, read for the pins
 * @returns {import('./upgrade.type.mjs').UpgradeApp[]} each app with the versions its migrations start from
 */
const upgradeApps = (rootDir, plan, sourceDir = rootDir) => {
  const dirs = appDirs(rootDir);
  return (dirs.length > 0 ? dirs : [rootDir]).map(appOf(rootDir, plan, sourceDir));
};

export { upgradeApps };
