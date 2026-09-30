/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} rootDir
 * @param {string} packageName a direct dependency of the app
 * @returns {boolean} whether pnpm linked it into node_modules
 */
const isInstalled = (rootDir, packageName) => existsSync(join(rootDir, 'node_modules', ...packageName.split('/'), 'package.json'));

export { isInstalled };
