/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';

/**
 * @param {string} from @param {string} to  Absolute paths
 * @returns {boolean}  True when the target exists and is not older than the source
 */
const isCurrent = (from, to) => existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs;

export { isCurrent };
