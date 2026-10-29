/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SWITCH_FILE = 'remote.json';

/**
 * @param {Record<string, string | undefined>} env
 * @returns {boolean} false on GitHub Actions or when remote.json says remote
 */
const isLocalMode = (env) => {
  if (env.GITHUB_ACTIONS) return false;
  try {
    const home = env.COORD_HOME || join(homedir(), '.coord');
    return JSON.parse(readFileSync(join(home, SWITCH_FILE), 'utf8')).mode !== 'remote';
  } catch {
    return true;
  }
};

export { isLocalMode };
