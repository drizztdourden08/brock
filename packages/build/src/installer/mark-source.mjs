/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { BRAND_DIR, DARK_GROUND_DIR } from '../icons/brand-files.mjs';
import { brandsRoot } from '../icons/brand-folder.mjs';
import { brandRim } from '../icons/brand-rim.mjs';
import { BRAND_MARK_PNG, DEFAULT_MARK, PUBLIC_DIR, TILED_ICON } from './installer.constants.mjs';

/**
 * @typedef {{ data: Buffer, mime: string, from: string }} MarkSource  from: where it was read
 */

/**
 * @param {string} base  the folder rel is under
 * @param {string | null} rel
 * @returns {MarkSource | null}
 */
const readImage = (base, rel) => {
  const file = rel ? join(base, rel) : null;
  if (!file || !existsSync(file)) return null;
  const mime = extname(file).toLowerCase() === '.svg' ? 'image/svg+xml' : 'image/png';
  return { data: readFileSync(file), mime, from: rel.split('\\').join('/') };
};

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductConfig['icons']} icons
 * @param {'light' | 'dark'} ground
 * @returns {string}  brand/dark-ground, else brand or its rim set
 */
const groundRoot = (icons, ground) => (ground === 'dark' ? join(BRAND_DIR, DARK_GROUND_DIR) : brandsRoot(brandRim(icons)));

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductConfig} config
 * @param {'light' | 'dark'} ground
 * @returns {{ png: string | null, svg: string | null }}  the brand files under the Tessera root
 */
const brandFiles = (config, ground) => {
  const brand = config.icons?.brand;
  if (!brand) return { png: null, svg: null };
  const root = groundRoot(config.icons, ground);
  return { png: config.logos.mark === DEFAULT_MARK ? join(root, brand, BRAND_MARK_PNG) : null, svg: join(root, `${brand}.svg`) };
};

/**
 * @param {string} rootDir  The app root
 * @param {Pick<import('./installer-inputs.mjs').InstallerInputs, 'config' | 'tesseraRoot'>} inputs
 * @param {{ ground?: 'light' | 'dark' }} [opts]  dark: the mark from brand/dark-ground
 * @returns {MarkSource | null}  the transparent mark, the tiled icon last
 */
const markSourceOf = (rootDir, { config, tesseraRoot }, { ground = 'light' } = {}) => {
  const brand = brandFiles(config, ground);
  return readImage(tesseraRoot, brand.png)
    ?? readImage(rootDir, join(PUBLIC_DIR, config.logos.mark))
    ?? readImage(tesseraRoot, brand.svg)
    ?? readImage(rootDir, config.icons?.png256 ?? TILED_ICON);
};

export { markSourceOf };
