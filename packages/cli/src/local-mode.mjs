/* @layer tooling-scripts @kind logic */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { remoteMode } from '@drizztdourden08/brock-thread/remote-mode';

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {boolean} true unless the coord switch says remote
 */
const localModeOn = (env = process.env) => remoteMode(env.COORD_HOME || join(homedir(), '.coord')) === 'local';

export { localModeOn };
