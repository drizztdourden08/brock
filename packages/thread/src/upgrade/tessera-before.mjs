/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { brockInstallOf } from './brock-install.mjs';
import { TESSERA_PACKAGE } from './upgrade.constants.mjs';

const appsOf = (dir) => {
  const apps = join(dir, 'apps');
  return existsSync(apps) ? readdirSync(apps, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => join(apps, entry.name)) : [];
};

const installedIn = (dir) => brockInstallOf.packageOf(join(dir, 'node_modules', ...TESSERA_PACKAGE.split('/')))?.version ?? null;

/**
 * @param {string} dir the upgrade worktree, before pnpm install
 * @returns {string | null} for --tessera-from; null when pinned or absent
 */
const tesseraBefore = (dir) => {
  if (typeof brockInstallOf.packageOf(dir)?.brock?.tessera === 'string') return null;
  const version = [dir, ...appsOf(dir)].map(installedIn).find(Boolean);
  return version ? String(version) : null;
};

export { tesseraBefore };
