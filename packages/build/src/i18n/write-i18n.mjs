/* @layer tooling-scripts @kind logic */
import { writeChanged } from '../write-changed.mjs';
import { renderI18nFiles } from './render-i18n.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} the paths rewritten this run
 */
const writeI18nFiles = (rootDir) => writeChanged(rootDir, renderI18nFiles(rootDir));

export { writeI18nFiles };
