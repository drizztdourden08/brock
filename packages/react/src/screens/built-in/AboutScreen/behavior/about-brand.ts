/* @layer renderer-shell @kind logic */
import { BRAND_APPS, BRAND_FAMILY } from '@drizztdourden08/tessera/brand';
import type { BrandApp } from '@drizztdourden08/tessera/brand';
import type { ProductConfig } from '@drizztdourden08/brock-core';

const aboutBrand = (product: ProductConfig): BrandApp | undefined =>
  BRAND_APPS.find((app) => app === product.icons.brand && BRAND_FAMILY[app].name === product.name);

export { aboutBrand };
