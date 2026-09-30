/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_TOKENS_JSON } from '../look/look.constants.mjs';
import { HEX_COLOR } from '../packaging/packaging.constants.mjs';
import { THEME_KEYS } from './installer.constants.mjs';

/**
 * @typedef {Record<string, string>} ThemeTokens  bg, surface, text and the rest
 */

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @returns {ThemeTokens | null}  theme.dark, or null when absent
 */
const readThemeTokens = (tesseraRoot) => {
  const file = join(tesseraRoot, TESSERA_TOKENS_JSON);
  if (!existsSync(file)) return null;
  const dark = JSON.parse(readFileSync(file, 'utf8'))?.theme?.dark;
  if (!dark || !THEME_KEYS.every((key) => typeof dark[key] === 'string' && HEX_COLOR.test(dark[key]))) return null;
  return Object.fromEntries(THEME_KEYS.map((key) => [key, dark[key].toLowerCase()]));
};

export { readThemeTokens };
