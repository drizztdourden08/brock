/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { MISSING_MODULE_CODES } from '../../look/look.constants.mjs';

const requireFrom = (base) => {
  try {
    return createRequire(base)('typescript');
  } catch (error) {
    if (!MISSING_MODULE_CODES.has(error?.code)) throw error;
    return null;
  }
};

/**
 * @param {string} rootDir the app folder
 * @returns {typeof import('typescript') | null} the app's own first, then Brock's
 */
const loadTypescript = (rootDir) => requireFrom(join(rootDir, 'package.json')) ?? requireFrom(import.meta.url);

export { loadTypescript };
