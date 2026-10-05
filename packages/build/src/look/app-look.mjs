/* @layer tooling-scripts @kind logic */
import { loadCore } from './load-core.mjs';
import { loadLookSources } from './load-look-sources.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {Promise<{ config: import('@drizztdourden08/brock-core/product').ProductConfig, look: import('@drizztdourden08/brock-core/look').ResolvedLook, dark: import('@drizztdourden08/brock-core/look').DarkPair | null }>}
 */
const appLook = async (rootDir, product) => {
  const core = await loadCore(rootDir);
  const config = core.defineProduct(product);
  const sources = loadLookSources(rootDir, config);
  const look = core.resolveLook(config, sources);
  return { config, look, dark: core.darkPair(look, sources) };
};

export { appLook };
