/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { ProductConfig } from '@drizztdourden08/brock-core';
import type { TesseraOverrides } from '@drizztdourden08/tessera/primitives';
import { mergeStringGroups } from '../../../i18n/merge-string-groups';
import { tesseraStringsOf } from '../../../i18n/tessera-strings-of';
import { useI18n } from '../../../i18n/useI18n';
import { tesseraOverrides } from './tessera-overrides';
import { useBrandPalette } from './useBrandPalette';

const useTesseraSetup = (product: ProductConfig): TesseraOverrides => {
  useBrandPalette(product.icons.brand);
  const { i18n, locale } = useI18n();
  return useMemo(() => {
    const base = tesseraOverrides(product.menu);
    const translated = tesseraStringsOf(i18n);
    return Object.keys(translated).length === 0 ? base : { ...base, strings: mergeStringGroups(translated, base.strings) };
  }, [product.menu, i18n, locale]);
};

export { useTesseraSetup };
