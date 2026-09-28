/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BRAND_FILES } from './brand-files.mjs';
import { locateBrand } from './locate-brand.mjs';

/**
 * @typedef {object} CopyResult
 * @property {string} brandDir The source folder the set came from
 * @property {string[]} written Root-relative paths copied this run
 * @property {string[]} current Root-relative paths already newer than their source
 */

const isCurrent = (from, to) => existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs;

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
  const written = [];
  const current = [];
  for (const { from, to } of BRAND_FILES) {
    const source = join(brandDir, from);
    if (!existsSync(source)) throw new Error(`Brand "${brand}" is missing ${source}`);
    const target = join(rootDir, to);
    if (!force && isCurrent(source, target)) {
      current.push(to);
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    written.push(to);
  }
  return { brandDir, written, current };
};

export { copyBrandIcons };
