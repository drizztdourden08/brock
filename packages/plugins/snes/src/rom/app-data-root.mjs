/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

const platformRoot = () => {
  if (process.platform === 'win32') return process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming');
  if (process.platform === 'darwin') return join(homedir(), 'Library', 'Application Support');
  return process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config');
};

const appNameOf = (main) => {
  try {
    return JSON.parse(readFileSync(join(main, 'package.json'), 'utf8')).name ?? basename(main);
  } catch {
    return basename(main);
  }
};

/**
 * @param {string} main the main checkout, whose package name is the app name
 * @returns {string} the app's per-user Data folder
 */
const appDataDir = (main) => join(platformRoot(), appNameOf(main), 'Data');

export { appDataDir };
