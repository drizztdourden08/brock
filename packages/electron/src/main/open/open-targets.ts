/* @layer electron-main @kind logic */
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import type { OpenTargets } from './open.type';

const openTargets = (product: Pick<ProductConfig, 'protocols' | 'fileAssociations'>): OpenTargets => ({
  schemes: product.protocols.map(({ scheme }) => scheme.toLowerCase()),
  extensions: product.fileAssociations.map(({ ext }) => ext.toLowerCase()),
});

export { openTargets };
