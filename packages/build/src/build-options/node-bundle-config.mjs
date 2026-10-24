/* @layer tooling-scripts @kind config */
import { resolve } from 'node:path';
import { appAliases } from './app-aliases.mjs';
import { CJS_GLOBALS_BANNER, CJS_GLOBALS_DEFINE, NODE_BUNDLE_TARGET } from './build-options.constants.mjs';
import { defineValues } from './define-values.mjs';

const ELECTRON = /^electron(?:\/|$)/;

/**
 * @param {string} label what the bundle is, for the message
 * @returns {import('vite').Plugin} refuses an Electron import
 */
const noElectron = (label) => ({
  name: 'brock-node-bundle-no-electron',
  enforce: 'pre',
  resolveId(id, importer) {
    if (ELECTRON.test(id)) this.error(`the ${label} runs as plain Node and cannot import "${id}" (from ${importer ?? 'its entry'}).`);
    return null;
  },
});

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig['build']} build build of brock.config.ts
 * @param {{ label: string, entry: string, outDir: string, fileName: string, plugins?: import('vite').Plugin[] }} bundle
 * @returns {import('vite').InlineConfig} one ES module file for plain Node, dependencies inlined
 */
const nodeBundleConfig = (rootDir, build, { label, entry, outDir, fileName, plugins = [] }) => ({
  configFile: false,
  root: rootDir,
  publicDir: false,
  logLevel: 'warn',
  mode: 'production',
  plugins: [noElectron(label), ...plugins],
  resolve: { alias: appAliases(rootDir, build) },
  define: { ...CJS_GLOBALS_DEFINE, ...defineValues(build?.define, 'brock.config.ts') },
  ssr: { noExternal: true, target: 'node' },
  build: {
    ssr: entry,
    outDir: resolve(rootDir, outDir),
    emptyOutDir: false,
    target: NODE_BUNDLE_TARGET,
    minify: false,
    sourcemap: false,
    rollupOptions: { output: { format: 'es', banner: CJS_GLOBALS_BANNER, entryFileNames: fileName, inlineDynamicImports: true } },
  },
});

export { nodeBundleConfig };
