/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderBootFiles } from './render-boot-files.mjs';

/**
 * @param {string} rootDir  The app root
 * @returns {string[]}  The registries rewritten this run
 */
const writeBootFiles = (rootDir) => writeChanged(rootDir, renderBootFiles(rootDir));

export { writeBootFiles };
