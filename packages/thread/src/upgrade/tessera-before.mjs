/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { brockInstallOf } from './brock-install.mjs';
import { TESSERA_PACKAGE } from './upgrade.constants.mjs';

const pinIn = (dir) => {
  const pinned = brockInstallOf.packageOf(dir)?.brock?.tessera;
  return typeof pinned === 'string' ? pinned : null;
};

const installedIn = (dir) => brockInstallOf.packageOf(join(dir, 'node_modules', ...TESSERA_PACKAGE.split('/')))?.version ?? null;

/**
 * @param {string} rootDir the upgrade worktree, before pnpm install
 * @param {string} [appDir] the app inside it; the root itself for a single app
 * @returns {string | null} for --tessera-from
 */
const tesseraBefore = (rootDir, appDir = rootDir) => {
  const version = pinIn(appDir) ?? pinIn(rootDir) ?? installedIn(appDir) ?? installedIn(rootDir);
  return version ? String(version) : null;
};

export { tesseraBefore };
