/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appThemeCss } from '../look/app-theme-css.mjs';
import { brandPaletteCss } from '../look/brand-palette-css.mjs';
import { TOKEN_FILES, TOKEN_LAYERS, TOKENS_DIR } from './splash.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @param {string | null} [brand]  The Tessera brand id from product.icons.brand
 * @returns {string}  the tokens, the brand palette, then theme.css
 */
const readTokenCss = (rootDir, tesseraRoot, brand = null) => {
  const tokens = TOKEN_FILES.map((name) => readFileSync(join(tesseraRoot, TOKENS_DIR, name), 'utf8'));
  const palette = brandPaletteCss(tesseraRoot, brand);
  const theme = appThemeCss(rootDir);
  return [TOKEN_LAYERS, ...tokens, palette ? readFileSync(palette, 'utf8') : '', existsSync(theme) ? readFileSync(theme, 'utf8') : ''].join('\n');
};

export { readTokenCss };
