/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderStartupFiles } from './render-startup.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} the paths rewritten this run
 */
const writeStartupFile = (rootDir) => writeChanged(rootDir, renderStartupFiles(rootDir));

export { writeStartupFile };
