/* @layer tooling-scripts @kind logic */
import { DERIVED_BASE_COUNT, DERIVED_BASE_MIN, DERIVED_BASE_STEP } from './ports.constants.mjs';

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

const fnv1a = (text) => {
  let hash = FNV_OFFSET;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), FNV_PRIME) >>> 0;
  return hash;
};

/**
 * @param {string} id the product id
 * @returns {number} a base from 20000 to 47800, a multiple of 200
 */
const derivePortBase = (id) => DERIVED_BASE_MIN + (fnv1a(id) % DERIVED_BASE_COUNT) * DERIVED_BASE_STEP;

export { derivePortBase };
