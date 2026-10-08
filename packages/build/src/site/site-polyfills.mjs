/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../import-from-app.mjs';
import { NODE_POLYFILLS_PACKAGE, SITE_CONFIG_FILE } from './site.constants.mjs';

/**
 * @param {string} siteDir
 * @param {boolean | Record<string, unknown>} setting build.nodePolyfills
 * @returns {Promise<import('vite').PluginOption[]>}
 */
const sitePolyfills = async (siteDir, setting) => {
  if (setting === false) return [];
  let loaded;
  try {
    loaded = await importFromApp(siteDir, NODE_POLYFILLS_PACKAGE);
  } catch (error) {
    throw new Error(`${SITE_CONFIG_FILE} build.nodePolyfills needs ${NODE_POLYFILLS_PACKAGE} in the site: pnpm add -D ${NODE_POLYFILLS_PACKAGE}`, { cause: error });
  }
  const nodePolyfills = loaded.nodePolyfills ?? loaded.default?.nodePolyfills;
  if (typeof nodePolyfills !== 'function') throw new Error(`${NODE_POLYFILLS_PACKAGE} exports no nodePolyfills function`);
  return [nodePolyfills(setting === true ? {} : setting)];
};

export { sitePolyfills };
