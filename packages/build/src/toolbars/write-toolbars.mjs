/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderToolbarsFiles } from './render-toolbars.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} the paths rewritten this run
 */
const writeToolbarsFile = (rootDir) => writeChanged(rootDir, renderToolbarsFiles(rootDir));

export { writeToolbarsFile };
