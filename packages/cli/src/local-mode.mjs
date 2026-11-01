/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SWITCH_FILE = 'remote.json';

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {boolean} true unless the coord switch says remote, as brock-thread reads it
 */
const localModeOn = (env = process.env) => {
  try {
    const home = env.COORD_HOME || join(homedir(), '.coord');
    return JSON.parse(readFileSync(join(home, SWITCH_FILE), 'utf8')).mode !== 'remote';
  } catch {
    return true;
  }
};

export { localModeOn };
