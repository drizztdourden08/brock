/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderWidgetsFiles } from './render-widgets.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} the paths rewritten this run
 */
const writeWidgetsFile = (rootDir) => writeChanged(rootDir, renderWidgetsFiles(rootDir));

export { writeWidgetsFile };
