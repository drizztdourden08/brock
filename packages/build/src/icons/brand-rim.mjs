/* @layer tooling-scripts @kind logic */
import { BRAND_RIMS } from './brand-files.mjs';

/**
 * @param {{ brand?: string, rim?: 'light' | 'dark' } | undefined} icons  product.icons, raw or from defineProduct
 * @returns {'light' | 'dark' | null}  icons.rim, else the brand default, else none
 */
const brandRim = (icons) => {
  if (!icons?.brand) return null;
  return icons.rim ?? BRAND_RIMS[icons.brand] ?? null;
};

export { brandRim };
