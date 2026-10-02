/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { MISSING_MODULE_CODES, TESSERA_CONFIG_ENTRY } from './look.constants.mjs';

/**
 * @param {string} rootDir  The app or repo root
 * @returns {typeof import('@drizztdourden08/tessera/config') | null}  null without Tessera or its config entry
 */
const tesseraConfigModule = (rootDir) => {
  try {
    return createRequire(join(rootDir, 'package.json'))(TESSERA_CONFIG_ENTRY);
  } catch (error) {
    if (MISSING_MODULE_CODES.has(error?.code)) return null;
    throw error;
  }
};

export { tesseraConfigModule };
