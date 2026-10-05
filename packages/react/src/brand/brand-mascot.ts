/* @layer renderer-shell @kind logic */
import { BRAND_APPS, BRAND_FAMILY } from '@drizztdourden08/tessera/brand';
import type { AnimatedMascotBrand } from '@drizztdourden08/tessera/brand';

const isMascotBrand = (brand: string): brand is AnimatedMascotBrand =>
  BRAND_APPS.some((app) => app === brand && BRAND_FAMILY[app].mascot !== undefined);

const brandMascot = (brand: string | undefined): AnimatedMascotBrand | null =>
  (brand !== undefined && isMascotBrand(brand) ? brand : null);

export { brandMascot };
