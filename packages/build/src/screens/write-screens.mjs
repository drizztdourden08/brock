/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderScreensFiles } from './render-screens.mjs';

/**
 * @param {string} rootDir
 * @returns {boolean} true when .brock/screens.ts or .brock/search.ts changed
 */
const writeScreensFile = (rootDir) => writeChanged(rootDir, renderScreensFiles(rootDir)).length > 0;

export { writeScreensFile };
