/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../import-from-app.mjs';
import { NODE_POLYFILLS_PACKAGE } from './build-options.constants.mjs';

const optionsOf = (setting) => (setting === true ? {} : setting);

const loadPlugin = async (rootDir) => {
  try {
    const loaded = await importFromApp(rootDir, NODE_POLYFILLS_PACKAGE);
    return loaded.nodePolyfills ?? loaded.default?.nodePolyfills;
  } catch {
    throw new Error(`brock.config.ts build.nodePolyfills needs ${NODE_POLYFILLS_PACKAGE} in the app: pnpm add -D ${NODE_POLYFILLS_PACKAGE}`);
  }
};

/**
 * @param {string} rootDir the app root
 * @param {{ nodePolyfills?: boolean | Record<string, unknown> } | undefined} build build of brock.config.ts
 * @returns {Promise<() => import('vite').PluginOption[]>} fresh plugins per call, none when off
 */
const nodePolyfillPlugins = async (rootDir, build) => {
  const setting = build?.nodePolyfills ?? false;
  if (setting === false) return () => [];
  const nodePolyfills = await loadPlugin(rootDir);
  if (typeof nodePolyfills !== 'function') throw new Error(`${NODE_POLYFILLS_PACKAGE} exports no nodePolyfills function`);
  return () => [nodePolyfills(optionsOf(setting))];
};

export { nodePolyfillPlugins };
