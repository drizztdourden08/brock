/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { BRAND_DIR } from './brand-files.mjs';

/**
 * @param {'light' | 'dark' | null} rim
 * @returns {string}  brand, or brand/<rim>-rim, in the Tessera package
 */
const brandsRoot = (rim) => (rim ? join(BRAND_DIR, `${rim}-rim`) : BRAND_DIR);

/**
 * @param {string} brand @param {'light' | 'dark' | null} rim
 * @returns {string}  brand/<brand>, or brand/<rim>-rim/<brand>
 */
const brandFolder = (brand, rim) => join(brandsRoot(rim), brand);

export { brandsRoot, brandFolder };
