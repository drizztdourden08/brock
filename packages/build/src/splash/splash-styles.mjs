/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { lookProperties } from './look-properties.mjs';
import { readSplashFonts } from './read-splash-fonts.mjs';
import { readTokenCss } from './read-token-css.mjs';
import { SPLASH_STYLESHEET, TESSERA_SPLASH_STYLESHEET } from './splash.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {{ look: import('@drizztdourden08/brock-core/look').ResolvedLook, dark: import('@drizztdourden08/brock-core/look').DarkPair | null }} looks  dark: the splash ground of an app with colours of its own
 * @param {string | null} [brand]  The Tessera brand id from product.icons.brand
 * @returns {string}  Every rule the splash page needs, in cascade order
 */
const splashStyles = (rootDir, { look, dark }, brand = null) => {
  const tesseraRoot = tesseraDir(rootDir);
  return [
    readSplashFonts(tesseraRoot),
    readTokenCss(rootDir, tesseraRoot, brand),
    lookProperties(look, dark),
    readFileSync(join(tesseraRoot, TESSERA_SPLASH_STYLESHEET), 'utf8'),
    readFileSync(join(import.meta.dirname, SPLASH_STYLESHEET), 'utf8'),
  ].join('\n');
};

export { splashStyles };
