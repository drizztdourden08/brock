/* @layer tooling-scripts @kind logic */
import { BRAND_FILES } from './brand-files.mjs';
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
  const brand = config.product?.icons?.brand;
  if (!brand) return null;
  const brandDir = locateBrand(rootDir, brand);
  const base = copyFiles(brandDir, rootDir, BRAND_FILES, force);
  const bot = writeBotVariant(brandDir, rootDir, force);
  return { brandDir, written: [...base.written, ...bot.written], current: [...base.current, ...bot.current] };
};

export { copyBrandIcons };
