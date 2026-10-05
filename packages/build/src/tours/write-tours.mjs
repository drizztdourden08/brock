/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderToursFiles } from './render-tours.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} the paths rewritten this run
 */
const writeToursFile = (rootDir) => writeChanged(rootDir, renderToursFiles(rootDir));

export { writeToursFile };
