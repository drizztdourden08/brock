/* @layer tooling-scripts @kind config */
import { resolve } from 'node:path';
import { appTools } from './app-tools.mjs';
import { appAliases } from './build-options/app-aliases.mjs';
import { WORKER_FORMAT } from './build-options/build-options.constants.mjs';
import { nodePolyfillPlugins } from './build-options/node-polyfills.mjs';
import { devOnlyPlugin } from './dev-only/dev-only-plugin.mjs';
import { loadBrockConfig } from './load-config.mjs';
import { webManifestPlugin } from './platforms/web/web-manifest-plugin.mjs';
import { WEB_OUT_DIR } from './platforms/web/web.constants.mjs';
import { splashPlugin } from './splash/splash-plugin.mjs';
import { SHARED_SINGLETONS } from './vite.constants.mjs';

/**
 * @param {string} rootDir The app root (the folder holding brock.config.ts)
 * @param {import('vite').UserConfig} [overrides] Merged over the base config
 * @returns {Promise<import('vite').UserConfig>} the renderer alone, relative base, into dist/web
 */
const defineBrockWebConfig = async (rootDir, overrides = {}) => {
  const { mergeConfig, react } = await appTools(rootDir);
  const { product, web, build } = await loadBrockConfig(rootDir);
  const src = resolve(rootDir, 'src');
  const manifest = web?.manifest === false ? [] : [webManifestPlugin({ rootDir, product })];
  const polyfills = await nodePolyfillPlugins(rootDir, build);
  const base = {
    root: src,
    base: './',
    publicDir: resolve(rootDir, 'public'),
    plugins: [devOnlyPlugin({ rootDir }), react(), ...polyfills(), splashPlugin({ rootDir, product }), ...manifest],
    worker: { format: WORKER_FORMAT, plugins: () => [devOnlyPlugin({ rootDir }), ...polyfills()] },
    resolve: { alias: appAliases(rootDir, build), dedupe: SHARED_SINGLETONS },
    build: { outDir: resolve(rootDir, WEB_OUT_DIR), emptyOutDir: true, rollupOptions: { input: { index: resolve(src, 'index.html') } } },
  };
  return mergeConfig(base, overrides);
};

export { defineBrockWebConfig };
