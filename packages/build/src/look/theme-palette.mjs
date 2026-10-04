/* @layer tooling-scripts @kind logic */
import { appThemeCss } from './app-theme-css.mjs';
import { SEED_NAMES } from './look.constants.mjs';
import { readPaletteSeed } from './read-palette-seeds.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {string | null | undefined} brand  The Tessera brand id from product.icons.brand
 * @returns {string | null}  the brand, unless theme.css sets seeds
 */
const themePalette = (rootDir, brand) => {
  if (!brand) return null;
  const themeCss = appThemeCss(rootDir);
  const ownSeeds = Object.values(SEED_NAMES).some((name) => readPaletteSeed(themeCss, name) !== null);
  return ownSeeds ? null : brand;
};

export { themePalette };
