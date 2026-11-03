/* @layer tooling-scripts @kind logic */
import { DEV_MODE } from '../build-reuse/build-reuse.constants.mjs';
import { depsReady } from '../shared-deps-cache/shared-deps-cache-plugin.mjs';

/**
 * @param {any} vite the app's vite
 * @param {Record<string, any>} renderer the renderer config of electron-vite dev
 * @param {() => void} [onBundling] called when the pre-bundle starts
 * @returns {Promise<number | null>} bundled count; null when deps were in place
 */
const optimizeRenderer = async (vite, renderer, onBundling) => {
  const config = await vite.resolveConfig(renderer, 'serve', DEV_MODE);
  if (depsReady(config)) return null;
  onBundling?.();
  const metadata = await vite.optimizeDeps(config);
  await vite.resolveConfig(renderer, 'serve', DEV_MODE);
  return Object.keys(metadata?.optimized ?? {}).length;
};

export { optimizeRenderer };
