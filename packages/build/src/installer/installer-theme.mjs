/* @layer tooling-scripts @kind logic */
import { FALLBACK_THEME } from './installer.constants.mjs';
import { readThemeTokens } from './read-theme-tokens.mjs';

const logged = new Set();

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @returns {import('./read-theme-tokens.mjs').ThemeTokens}
 */
const installerTheme = (tesseraRoot) => {
  const tokens = readThemeTokens(tesseraRoot);
  if (tokens) return tokens;
  if (!logged.has(tesseraRoot)) {
    logged.add(tesseraRoot);
    console.log('brock package: Tessera has no tokens.json dark theme yet, so the installer keeps its built-in dark colours');
  }
  return FALLBACK_THEME;
};

export { installerTheme };
