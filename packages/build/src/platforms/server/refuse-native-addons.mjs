/* @layer tooling-scripts @kind logic */
import { dirname } from 'node:path/posix';
import { importerPackage } from './importer-package.mjs';
import { ADDON_STUB_FILE, NATIVE_ADDON, NATIVE_LOADERS } from './server.constants.mjs';

const slashed = (path) => path.replace(/[?#].*$/, '').replaceAll('\\', '/');

/**
 * @param {string[]} optionalAddons packages whose addon load is optional
 * @returns {import('vite').Plugin} refuses a native addon, stubs it in a listed package
 */
const refuseNativeAddons = (optionalAddons = []) => {
  const optional = new Set(optionalAddons);
  return {
    name: 'brock-server-no-native-addons',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!NATIVE_ADDON.test(id) && !NATIVE_LOADERS.has(id)) return null;
      const owner = importerPackage(importer);
      if (owner !== null && optional.has(owner)) return `${dirname(slashed(importer))}/${ADDON_STUB_FILE}`;
      const from = owner === null ? `from ${importer ?? 'its entry'}` : `from ${importer}, in the package "${owner}"`;
      const hint = owner === null ? '' : ` If "${owner}" loads it inside a try/catch and works without it, list it in server.optionalAddons in brock.config.ts.`;
      this.error(`the server bundle cannot carry the native addon "${id}" (${from}). A native .node addon is not supported in a server app: use a pure JavaScript package instead.${hint}`);
      return null;
    },
    load(id) {
      if (!slashed(id).endsWith(`/${ADDON_STUB_FILE}`)) return null;
      return `module.exports = {};\nthrow new Error(${JSON.stringify(`the native addon of "${importerPackage(id)}" is not in the server bundle (server.optionalAddons)`)});\n`;
    },
  };
};

export { refuseNativeAddons };
