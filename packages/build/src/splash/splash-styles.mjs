/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { lookProperties } from './look-properties.mjs';
import { readSplashFonts } from './read-splash-fonts.mjs';
import { readTokenCss } from './read-token-css.mjs';
import { SPLASH_STYLESHEET } from './splash.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/look').ResolvedLook} look
 * @param {string | null} [brand]  The Tessera brand id from product.icons.brand
 * @returns {string}  Every rule the splash page needs, in cascade order
 */
const splashStyles = (rootDir, look, brand = null) => {
  const tesseraRoot = tesseraDir(rootDir);
  return [
    readSplashFonts(tesseraRoot),
    readTokenCss(rootDir, tesseraRoot, brand),
    lookProperties(look),
    readFileSync(join(import.meta.dirname, SPLASH_STYLESHEET), 'utf8'),
  ].join('\n');
};

export { splashStyles };
