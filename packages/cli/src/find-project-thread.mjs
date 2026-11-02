/* @layer tooling-scripts @kind logic */
import { findInstalled } from './find-installed.mjs';

/**
 * @param {string} cwd
 * @returns {import('./find-installed.mjs').InstalledPackage | null} the nearest brock-thread a project installed
 */
const findProjectThread = (cwd) => findInstalled(cwd, '@drizztdourden08/brock-thread', 'brock-thread.mjs');

export { findProjectThread };
