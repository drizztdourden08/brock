/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';

const APPS_DIR = 'apps';
const DEFAULT_APP_DIR = 'apps/desktop';

/**
 * @param {string} rootDir the repo root
 * @returns {string} the app the release workflow packages
 */
const releaseAppDir = (rootDir) => {
  if (existsSync(join(rootDir, CONFIG_FILE))) return '.';
  const apps = join(rootDir, APPS_DIR);
  if (!existsSync(apps)) return DEFAULT_APP_DIR;
  const found = readdirSync(apps, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && existsSync(join(apps, entry.name, CONFIG_FILE)));
  return found ? `${APPS_DIR}/${found.name}` : DEFAULT_APP_DIR;
};

export { releaseAppDir };
