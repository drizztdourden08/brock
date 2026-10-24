/* @layer tooling-scripts @kind config */
import { nodeBundleConfig } from '../../build-options/node-bundle-config.mjs';
import { refuseNativeAddons } from './refuse-native-addons.mjs';
import { optionalAddonsOf } from './server-options.mjs';
import { serverEntry } from './server-entry.mjs';
import { SERVER_FILE, SERVER_OUT } from './server.constants.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../../config.mjs').BrockConfig} config brock.config.ts
 * @returns {import('vite').InlineConfig} one standalone ES module file, dist/server/main.mjs
 */
const serverViteConfig = (rootDir, config) =>
  nodeBundleConfig(rootDir, config.build, {
    label: 'server',
    entry: serverEntry(rootDir, config.server),
    outDir: SERVER_OUT,
    fileName: SERVER_FILE,
    plugins: [refuseNativeAddons(optionalAddonsOf(config.server))],
  });

export { serverViteConfig };
