/* @layer tooling-scripts @kind logic */
import { NATIVE_ADDON, NATIVE_LOADERS } from './server.constants.mjs';

/**
 * @returns {import('vite').Plugin} refuses a native .node addon
 */
const refuseNativeAddons = () => ({
  name: 'brock-server-no-native-addons',
  enforce: 'pre',
  resolveId(id, importer) {
    if (!NATIVE_ADDON.test(id) && !NATIVE_LOADERS.has(id)) return null;
    this.error(`the server bundle cannot carry the native addon "${id}" (from ${importer ?? 'its entry'}). A native .node addon is not supported in a server app: use a pure JavaScript package instead.`);
    return null;
  },
});

export { refuseNativeAddons };
