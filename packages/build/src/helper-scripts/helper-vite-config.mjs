/* @layer tooling-scripts @kind config */
import { nodeBundleConfig } from '../build-options/node-bundle-config.mjs';
import { HELPER_APP_DEFINE, HELPER_EXT, HELPERS_OUT } from './helper-scripts.constants.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig['build']} build build of brock.config.ts
 * @param {{ name: string, entry: string }} helper
 * @param {string | undefined} appId the product id, for the helper define
 * @returns {import('vite').InlineConfig} one standalone ES module file in dist/helpers
 */
const helperViteConfig = (rootDir, build, { name, entry }, appId) => {
  const config = nodeBundleConfig(rootDir, build, { label: `${name} helper`, entry, outDir: HELPERS_OUT, fileName: `${name}${HELPER_EXT}` });
  return appId === undefined ? config : { ...config, define: { [HELPER_APP_DEFINE]: JSON.stringify(appId), ...config.define } };
};

export { helperViteConfig };
