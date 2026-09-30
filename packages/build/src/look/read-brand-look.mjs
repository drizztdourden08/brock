/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_TOKENS_JSON } from './look.constants.mjs';

/**
 * @param {unknown} value
 * @returns {value is string[]}
 */
const isGradient = (value) =>
  Array.isArray(value) && value.length >= 2 && value.length <= 3 && value.every((stop) => typeof stop === 'string' && /^#[0-9a-f]{6}$/i.test(stop));

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @param {string | undefined} brand  The Tessera brand id from product.icons.brand
 * @returns {import('@drizztdourden08/brock-core/look').ProductLook | null}
 */
const readBrandLook = (tesseraRoot, brand) => {
  const file = join(tesseraRoot, TESSERA_TOKENS_JSON);
  if (!brand || !existsSync(file)) return null;
  const entry = JSON.parse(readFileSync(file, 'utf8'))?.brands?.[brand];
  if (!isGradient(entry?.gradient)) return null;
  return { gradient: entry.gradient, ...(typeof entry.angle === 'number' ? { angle: entry.angle } : {}) };
};

export { readBrandLook };
