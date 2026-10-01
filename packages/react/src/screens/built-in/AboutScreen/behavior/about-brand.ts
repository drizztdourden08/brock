/* @layer renderer-shell @kind logic */
import { BRAND_APPS, BRAND_FAMILY } from '@drizztdourden08/tessera/brand';
import type { ProductConfig } from '@drizztdourden08/brock-core';
import type { AboutBrand } from './about-brand.type';

const aboutBrand = (product: ProductConfig): AboutBrand | undefined => {
  const brand = BRAND_APPS.find((app) => app === product.icons.brand);
  return brand && { brand, heading: BRAND_FAMILY[brand].name === product.name ? 'wordmark' : 'title' };
};

export { aboutBrand };
