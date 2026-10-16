/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { ProductConfig } from '@drizztdourden08/brock-core';
import type { TesseraOverrides } from '@drizztdourden08/tessera/primitives';
import { tesseraOverrides } from './tessera-overrides';
import { useBrandPalette } from './useBrandPalette';

const useTesseraSetup = (product: ProductConfig): TesseraOverrides => {
  useBrandPalette(product.icons.brand);
  return useMemo(() => tesseraOverrides(product.menu), [product.menu]);
};

export { useTesseraSetup };
