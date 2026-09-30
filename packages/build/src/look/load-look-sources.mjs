/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { APP_THEME_CSS, SEED_NAMES, TESSERA_PALETTE_CSS } from './look.constants.mjs';
import { readBrandLook } from './read-brand-look.mjs';
import { readPaletteSeed } from './read-palette-seeds.mjs';

/**
 * @param {string} rootDir @param {string} tesseraRoot @param {string} name
 * @returns {string}
 */
const seedOf = (rootDir, tesseraRoot, name) => {
  const value = readPaletteSeed(join(rootDir, APP_THEME_CSS), name) ?? readPaletteSeed(join(tesseraRoot, TESSERA_PALETTE_CSS), name);
  if (!value) throw new Error(`No ${name} colour in ${APP_THEME_CSS} or in Tessera's palette; the splash gradient needs it`);
  return value;
};

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {import('@drizztdourden08/brock-core/look').LookSources}
 */
const loadLookSources = (rootDir, product) => {
  const tesseraRoot = tesseraDir(rootDir);
  return {
    brand: readBrandLook(tesseraRoot, product.icons?.brand),
    seeds: { primary: seedOf(rootDir, tesseraRoot, SEED_NAMES.primary), black: seedOf(rootDir, tesseraRoot, SEED_NAMES.black) },
  };
};

export { loadLookSources };
