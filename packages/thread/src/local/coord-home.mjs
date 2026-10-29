/* @layer tooling-scripts @kind logic */
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * @returns {string} the coord home: COORD_HOME, else ~/.coord
 */
const coordHome = () => process.env.COORD_HOME || join(homedir(), '.coord');

export { coordHome };
