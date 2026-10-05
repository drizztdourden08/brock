/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { AnimatedMascot, BrandMark } from '@drizztdourden08/tessera/brand';
import type { BrandApp } from '@drizztdourden08/tessera/brand';
import type { HeroArt } from '@drizztdourden08/tessera/composites';
import { brandMascot } from '../../brand/brand-mascot';
import { HERO_GREETING } from './hero-brand-art.constants';

const heroBrandArt = (brand: BrandApp | undefined): HeroArt | undefined => {
  if (brand === undefined) return undefined;
  const node = brandMascot(brand) === null
    ? createElement(BrandMark, { app: brand, size: 'xl', ground: 'dark' })
    : createElement(AnimatedMascot, { brand: 'auto', animation: HERO_GREETING, size: 'xl' });
  return { kind: 'node', node };
};

export { heroBrandArt };
