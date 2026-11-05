/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} rootDir The app root
 * @returns {string} the version in the app's package.json
 */
const readAppVersion = (rootDir) => JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')).version;

export { readAppVersion };
