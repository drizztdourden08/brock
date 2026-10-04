/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { workspaceDirs } from '@drizztdourden08/standards/structure';
import { APP_MARKER } from './upgrade.constants.mjs';

const isApp = (dir) => existsSync(join(dir, APP_MARKER));

/**
 * @param {string} rootDir the repo root
 * @returns {string[]} the app folders, absolute
 */
const appDirs = (rootDir) => (isApp(rootDir) ? [rootDir] : workspaceDirs(rootDir).dirs.filter(isApp).sort());

export { appDirs };
