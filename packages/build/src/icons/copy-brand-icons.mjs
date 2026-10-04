/* @layer tooling-scripts @kind logic */
import { BRAND_FILES, markFile } from './brand-files.mjs';
import { brandRim } from './brand-rim.mjs';
import { copyFiles } from './copy-files.mjs';
import { locateBrand } from './locate-brand.mjs';
import { writeBotVariant } from './bot/write-bot-variant.mjs';

/**
 * @typedef {object} CopyResult
 * @property {string} brandDir The source folder the set came from
 * @property {string[]} written Root-relative paths written this run
 * @property {string[]} current Root-relative paths already newer than their source
 */

/**
 * @param {string} rootDir The app root
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ force?: boolean }} [opts]
 * @returns {CopyResult | null} null when the product names no brand
 */
const copyBrandIcons = (rootDir, config, { force = false } = {}) => {
  const icons = config.product?.icons;
  const brand = icons?.brand;
  if (!brand) return null;
  const brandDir = locateBrand(rootDir, brand, brandRim(icons));
  const base = copyFiles(brandDir, rootDir, [...BRAND_FILES, markFile(brand)], force);
  const bot = writeBotVariant(brandDir, rootDir, force || base.written.length > 0);
  return { brandDir, written: [...base.written, ...bot.written], current: [...base.current, ...bot.current] };
};

export { copyBrandIcons };
