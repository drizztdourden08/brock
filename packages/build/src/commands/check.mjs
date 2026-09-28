/* @layer tooling-scripts @kind logic */
import { runSync } from './sync.mjs';

/**
 * @param {{ rootDir: string}} ctx
 * @returns {Promise<number>} exit code
 */
const runCheck = ({ rootDir }) => runSync({ rootDir, check: true });

export { runCheck };
