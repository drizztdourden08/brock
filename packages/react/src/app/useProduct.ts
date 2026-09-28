/* @layer renderer-shell @kind hook */
import type { ProductConfig } from '@drizztdourden08/brock-core';
import { useBrock } from './useBrock';

const useProduct = (): ProductConfig => useBrock().product;

export { useProduct };
