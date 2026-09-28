/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { SPLASH_PAGE } from './splash.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @returns {boolean}  True when the app ships its own src/splash.html
 */
const ownsSplashPage = (rootDir) => existsSync(join(rootDir, 'src', SPLASH_PAGE));

export { ownsSplashPage };
