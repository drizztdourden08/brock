/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import type { AnimatedMascotChoice } from '@drizztdourden08/tessera/brand';
import { BrockContext } from '../app/brock-context';
import { brandMascot } from './brand-mascot';

const useBrandMascot = (): AnimatedMascotChoice | undefined =>
  (brandMascot(useContext(BrockContext)?.product.icons.brand) === null ? undefined : 'auto');

export { useBrandMascot };
