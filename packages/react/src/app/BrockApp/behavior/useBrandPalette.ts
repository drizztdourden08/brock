/* @layer renderer-shell @kind hook */
import { useLayoutEffect } from 'react';

const useBrandPalette = (brand: string | undefined): void => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (brand) root.dataset.palette = brand;
    else delete root.dataset.palette;
  }, [brand]);
};

export { useBrandPalette };
