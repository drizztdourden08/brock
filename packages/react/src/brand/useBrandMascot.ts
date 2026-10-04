/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { mascotForBrand } from '@drizztdourden08/tessera/brand';
import type { MascotName } from '@drizztdourden08/tessera/brand';
import { BrockContext } from '../app/brock-context';

const useBrandMascot = (): MascotName | undefined => mascotForBrand(useContext(BrockContext)?.product.icons.brand) ?? undefined;

export { useBrandMascot };
