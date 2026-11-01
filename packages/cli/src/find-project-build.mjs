/* @layer tooling-scripts @kind logic */
import { findInstalled } from './find-installed.mjs';

/**
 * @typedef {import('./find-installed.mjs').InstalledPackage} ProjectBuild
 */

/**
 * @param {string} cwd
 * @returns {ProjectBuild | null} the nearest brock-build a project installed
 */
const findProjectBuild = (cwd) => findInstalled(cwd, '@drizztdourden08/brock-build', 'brock.mjs');

export { findProjectBuild };
