/* @layer tooling-scripts @kind logic */
import { loadCore } from './load-core.mjs';
import { loadLookSources } from './load-look-sources.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {Promise<{ config: import('@drizztdourden08/brock-core/product').ProductConfig, look: import('@drizztdourden08/brock-core/look').ResolvedLook }>}
 */
const appLook = async (rootDir, product) => {
  const core = await loadCore(rootDir);
  const config = core.defineProduct(product);
  return { config, look: core.resolveLook(config, loadLookSources(rootDir, config)) };
};

export { appLook };
