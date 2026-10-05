/* @layer tooling-scripts @kind logic */
import { appThemeCss } from '../look/app-theme-css.mjs';
import { DARK_PAIR_NAMES } from '../look/look.constants.mjs';
import { readPaletteSeed } from '../look/read-palette-seeds.mjs';
import { AA_TEXT_RATIO, SPLASH_FALLBACK_INKS } from './installer.constants.mjs';
import { contrast } from './pick-ink.mjs';

/**
 * @typedef {{ from: string, to: string, ink: string }} SplashGround  the dark gradient and the text that reads on it
 */

/**
 * @param {string} rootDir  The app root
 * @returns {{ from: string, to: string } | null}  the dark pair theme.css sets
 */
const themePair = (rootDir) => {
  const themeCss = appThemeCss(rootDir);
  const from = readPaletteSeed(themeCss, DARK_PAIR_NAMES.from);
  const to = readPaletteSeed(themeCss, DARK_PAIR_NAMES.to);
  return from && to ? { from, to } : null;
};

/**
 * @param {import('./read-theme-tokens.mjs').ThemeTokens} theme
 * @returns {{ from: string, to: string }}  the palette's dark gradient, else surface to bg
 */
const tokenPair = (theme) => (theme.gradientDarkFrom && theme.gradientDarkTo
  ? { from: theme.gradientDarkFrom, to: theme.gradientDarkTo }
  : { from: theme.surface, to: theme.bg });

/**
 * @param {string[]} ends @param {string} ink
 * @returns {number}  the contrast at the end where the ink reads worst
 */
const lowest = (ends, ink) => Math.min(...ends.map((end) => contrast(end, ink)));

/**
 * @param {string[]} ends @param {string} text
 * @returns {string}  the text if it holds AA at both ends, else the best ink
 */
const readableInk = (ends, text) => (lowest(ends, text) >= AA_TEXT_RATIO
  ? text
  : SPLASH_FALLBACK_INKS.reduce((best, ink) => (lowest(ends, ink) > lowest(ends, best) ? ink : best), text));

/**
 * @param {string} rootDir  The app root
 * @param {{ dark: import('@drizztdourden08/brock-core/look').DarkPair | null, theme: import('./read-theme-tokens.mjs').ThemeTokens }} sources
 * @returns {SplashGround}  the boot splash's ground and its text colour
 */
const splashGround = (rootDir, { dark, theme }) => {
  const pair = dark ?? themePair(rootDir) ?? tokenPair(theme);
  const from = pair.from.toLowerCase();
  const to = pair.to.toLowerCase();
  return { from, to, ink: readableInk([from, to], theme.text) };
};

export { splashGround };
