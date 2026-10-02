/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { tesseraThemes } from '../look/tessera-themes.mjs';
import { DEFAULT_THEME_PATH, DEFAULT_TOKEN_GLOBS } from './tessera.constants.mjs';

/**
 * @param {string} rootDir  The repo root
 * @returns {string[]}  the configured themes, then the default globs
 */
const tokenGlobs = (rootDir) => {
  const themes = tesseraThemes(rootDir).map((file) => relative(rootDir, file).replace(/\\/g, '/'));
  return [...new Set([...themes.filter((path) => !DEFAULT_THEME_PATH.test(path)), ...DEFAULT_TOKEN_GLOBS])];
};

export { tokenGlobs };
