/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { BrandMark, ChosenMascot, mascotForBrand } from '@drizztdourden08/tessera/brand';
import type { BrandApp } from '@drizztdourden08/tessera/brand';
import type { HeroArt } from '@drizztdourden08/tessera/composites';

const heroBrandArt = (brand: BrandApp | undefined): HeroArt | undefined => {
  if (brand === undefined) return undefined;
  const mascot = mascotForBrand(brand);
  const node = mascot === null ? createElement(BrandMark, { app: brand, size: 'xl' }) : createElement(ChosenMascot, { mascot, size: 'xl' });
  return { kind: 'node', node };
};

export { heroBrandArt };
