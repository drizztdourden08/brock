/* @layer tooling-scripts @kind config */
import { nodeBundleConfig } from '../build-options/node-bundle-config.mjs';
import { HELPER_EXT, HELPERS_OUT } from './helper-scripts.constants.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig['build']} build build of brock.config.ts
 * @param {{ name: string, entry: string }} helper
 * @returns {import('vite').InlineConfig} one standalone ES module file in dist/helpers
 */
const helperViteConfig = (rootDir, build, { name, entry }) =>
  nodeBundleConfig(rootDir, build, { label: `${name} helper`, entry, outDir: HELPERS_OUT, fileName: `${name}${HELPER_EXT}` });

export { helperViteConfig };
