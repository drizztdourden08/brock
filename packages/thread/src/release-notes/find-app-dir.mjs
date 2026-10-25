/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CONFIG_FILE = 'brock.config.ts';
const APPS_DIR = 'apps';

/**
 * @param {string} repoDir the repo root
 * @returns {string | null} the app folder from the root, '.' for a root app, else null
 */
const findAppDir = (repoDir) => {
  if (existsSync(join(repoDir, CONFIG_FILE))) return '.';
  const apps = join(repoDir, APPS_DIR);
  if (!existsSync(apps)) return null;
  const found = readdirSync(apps, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && existsSync(join(apps, entry.name, CONFIG_FILE)));
  return found ? `${APPS_DIR}/${found.name}` : null;
};

export { findAppDir };
