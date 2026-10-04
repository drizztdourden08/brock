/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { appThemeCss } from './app-theme-css.mjs';
import { brandPaletteCss } from './brand-palette-css.mjs';
import { SEED_NAMES, TESSERA_PALETTE_CSS } from './look.constants.mjs';
import { readBrandLook } from './read-brand-look.mjs';
import { readLookInks } from './read-look-inks.mjs';
import { readPaletteSeed } from './read-palette-seeds.mjs';

/**
 * @param {{ rootDir: string, themeCss: string, tesseraRoot: string, brandCss: string | null }} files
 * @param {string} name
 * @returns {string}
 */
const seedOf = ({ rootDir, themeCss, tesseraRoot, brandCss }, name) => {
  const value = readPaletteSeed(themeCss, name)
    ?? (brandCss ? readPaletteSeed(brandCss, name) : null)
    ?? readPaletteSeed(join(tesseraRoot, TESSERA_PALETTE_CSS), name);
  if (!value) throw new Error(`No ${name} colour in ${relative(rootDir, themeCss).replace(/\\/g, '/')} or in Tessera's palettes; the splash gradient needs it`);
  return value;
};

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {import('@drizztdourden08/brock-core/look').LookSources}
 */
const loadLookSources = (rootDir, product) => {
  const tesseraRoot = tesseraDir(rootDir);
  const files = { rootDir, themeCss: appThemeCss(rootDir), tesseraRoot, brandCss: brandPaletteCss(tesseraRoot, product.icons?.brand) };
  const inks = readLookInks(files.tesseraRoot);
  return {
    brand: readBrandLook(files.tesseraRoot, product.icons?.brand),
    seeds: { primary: seedOf(files, SEED_NAMES.primary), black: seedOf(files, SEED_NAMES.black) },
    ...(inks ? { inks } : {}),
  };
};

export { loadLookSources };
