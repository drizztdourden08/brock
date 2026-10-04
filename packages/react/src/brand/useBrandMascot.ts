/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import type { MascotName } from '@drizztdourden08/tessera/brand';
import { BrockContext } from '../app/brock-context';
import { brandMascot } from './brand-mascot';

const useBrandMascot = (): MascotName | undefined => brandMascot(useContext(BrockContext)?.product.icons.brand);

export { useBrandMascot };
