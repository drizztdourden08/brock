/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { appThemeCss } from './app-theme-css.mjs';
import { SEED_NAMES, TESSERA_PALETTE_CSS } from './look.constants.mjs';
import { readBrandLook } from './read-brand-look.mjs';
import { readLookInks } from './read-look-inks.mjs';
import { readPaletteSeed } from './read-palette-seeds.mjs';

/**
 * @param {{ rootDir: string, themeCss: string, tesseraRoot: string }} files
 * @param {string} name
 * @returns {string}
 */
const seedOf = ({ rootDir, themeCss, tesseraRoot }, name) => {
  const value = readPaletteSeed(themeCss, name) ?? readPaletteSeed(join(tesseraRoot, TESSERA_PALETTE_CSS), name);
  if (!value) throw new Error(`No ${name} colour in ${relative(rootDir, themeCss).replace(/\\/g, '/')} or in Tessera's palette; the splash gradient needs it`);
  return value;
};

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {import('@drizztdourden08/brock-core/look').LookSources}
 */
const loadLookSources = (rootDir, product) => {
  const files = { rootDir, themeCss: appThemeCss(rootDir), tesseraRoot: tesseraDir(rootDir) };
  const inks = readLookInks(files.tesseraRoot);
  return {
    brand: readBrandLook(files.tesseraRoot, product.icons?.brand),
    seeds: { primary: seedOf(files, SEED_NAMES.primary), black: seedOf(files, SEED_NAMES.black) },
    ...(inks ? { inks } : {}),
  };
};

export { loadLookSources };
