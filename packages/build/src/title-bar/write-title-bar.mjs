/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderTitleBarFiles } from './render-title-bar.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} the paths rewritten this run
 */
const writeTitleBarFile = (rootDir) => writeChanged(rootDir, renderTitleBarFiles(rootDir));

export { writeTitleBarFile };
