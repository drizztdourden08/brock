/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_PALETTES_DIR } from './look.constants.mjs';

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @param {string | null | undefined} brand  The Tessera brand id from product.icons.brand
 * @returns {string | null}  that brand's palette stylesheet, or null
 */
const brandPaletteCss = (tesseraRoot, brand) => {
  if (!brand || !/^[a-z0-9-]+$/.test(brand)) return null;
  const file = join(tesseraRoot, TESSERA_PALETTES_DIR, `${brand}.css`);
  return existsSync(file) ? file : null;
};

export { brandPaletteCss };
