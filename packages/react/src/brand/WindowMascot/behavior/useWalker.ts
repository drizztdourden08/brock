/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { BrockContext } from '../../../app/brock-context';
import { brandMascot } from '../../brand-mascot';
import { DEFAULT_SEARCH_HINT } from '../WindowMascot.constants';
import type { WalkerSetup } from '../WindowMascot.type';

const useWalker = (): WalkerSetup | null => {
  const product = useContext(BrockContext)?.product;
  const brand = brandMascot(product?.icons.brand);
  if (!product || product.mascot === false || brand === null) return null;
  return { brand, hint: product.mascot?.searchHint ?? DEFAULT_SEARCH_HINT };
};

export { useWalker };
