/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { INSTALLER_DIR, INSTALLER_OVERRIDES } from './installer.constants.mjs';

/**
 * @param {string} rootDir  The repo root, for the labels
 * @param {string} appDir  An app folder
 * @returns {string[]}  one finding per file build/installer may not hold
 */
const checkInstallerFolder = (rootDir, appDir) => {
  const dir = join(appDir, INSTALLER_DIR);
  if (!existsSync(dir)) return [];
  const label = relative(rootDir, dir).split('\\').join('/');
  return readdirSync(dir)
    .filter((name) => !INSTALLER_OVERRIDES.includes(name))
    .map((name) => `${label}/${name}: ${INSTALLER_DIR} holds only ${INSTALLER_OVERRIDES.join(' and ')}; the rest of the installer comes from brock.config.ts`);
};

export { checkInstallerFolder };
