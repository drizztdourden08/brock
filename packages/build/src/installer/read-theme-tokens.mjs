/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_TOKENS_JSON } from '../look/look.constants.mjs';
import { HEX_COLOR } from '../packaging/packaging.constants.mjs';
import { OPTIONAL_THEME_KEYS, THEME_KEYS } from './installer.constants.mjs';

/**
 * @typedef {Record<string, string>} ThemeTokens  bg, surface, text, border when set
 */

/**
 * @param {unknown} value
 * @returns {value is string}
 */
const isHex = (value) => typeof value === 'string' && HEX_COLOR.test(value);

/**
 * @param {any} tokens  The parsed tokens.json
 * @param {string | null} palette  The brand palette the app shows
 * @returns {Record<string, unknown> | undefined}  that palette's dark set, else theme.dark
 */
const darkOf = (tokens, palette) => {
  const own = palette ? tokens?.palettes?.[palette]?.dark : undefined;
  return own ?? tokens?.theme?.dark;
};

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @param {string | null} [palette]  The brand palette the app shows
 * @returns {ThemeTokens | null}  the dark set, or null when absent
 */
const readThemeTokens = (tesseraRoot, palette = null) => {
  const file = join(tesseraRoot, TESSERA_TOKENS_JSON);
  if (!existsSync(file)) return null;
  const dark = darkOf(JSON.parse(readFileSync(file, 'utf8')), palette);
  if (!dark || !THEME_KEYS.every((key) => isHex(dark[key]))) return null;
  const keys = [...THEME_KEYS, ...OPTIONAL_THEME_KEYS.filter((key) => isHex(dark[key]))];
  return Object.fromEntries(keys.map((key) => [key, dark[key].toLowerCase()]));
};

export { readThemeTokens };
