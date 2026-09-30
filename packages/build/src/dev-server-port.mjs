/* @layer tooling-scripts @kind logic */
import { derivePortBase, portFor, portSlotOf } from '@drizztdourden08/brock-thread/ports';

/**
 * @param {string} rootDir the app root
 * @param {{ id: string, ports?: { base: number, strict?: boolean } }} product
 * @returns {{ port: number, strictPort: boolean }}
 */
const devServerPort = (rootDir, product) => ({
  port: portFor(product.ports?.base ?? derivePortBase(product.id), portSlotOf(rootDir)),
  strictPort: product.ports?.strict ?? true,
});

export { devServerPort };
