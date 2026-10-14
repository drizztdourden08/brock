/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { appThemeCss } from './app-theme-css.mjs';
import { brandPaletteCss } from './brand-palette-css.mjs';
import { TESSERA_PALETTE_CSS, TESSERA_TOKENS_JSON } from './look.constants.mjs';
import { tesseraConfigModule } from './tessera-config-module.mjs';

const attempt = (read) => {
  try {
    return read();
  } catch {
    return [];
  }
};

const tesseraFiles = (rootDir, product) => attempt(() => {
  const root = tesseraDir(rootDir);
  const brand = brandPaletteCss(root, product.icons?.brand);
  return [join(root, TESSERA_TOKENS_JSON), join(root, TESSERA_PALETTE_CSS), ...(brand ? [brand] : [])];
});

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {string[]}  the files appLook reads
 */
const lookFiles = (rootDir, product) => [
  join(rootDir, CONFIG_FILE),
  ...attempt(() => [appThemeCss(rootDir)]),
  ...attempt(() => [tesseraConfigModule(rootDir)?.findTesseraConfig(rootDir)].filter(Boolean)),
  ...tesseraFiles(rootDir, product),
];

export { lookFiles };
