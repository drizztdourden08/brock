/* @layer tooling-scripts @kind config */
import { resolve } from 'node:path';
import { appAliases } from '../build-options/app-aliases.mjs';
import { defineValues } from '../build-options/define-values.mjs';
import { HELPER_EXT, HELPER_TARGET, HELPERS_OUT } from './helper-scripts.constants.mjs';

const ELECTRON = /^electron(?:\/|$)/;

/**
 * @param {string} name the helper
 * @returns {import('vite').Plugin} refuses an Electron import
 */
const noElectron = (name) => ({
  name: 'brock-helper-no-electron',
  enforce: 'pre',
  resolveId(id, importer) {
    if (ELECTRON.test(id)) this.error(`the ${name} helper runs as plain Node and cannot import "${id}" (from ${importer ?? 'its entry'}).`);
    return null;
  },
});

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig['build']} build build of brock.config.ts
 * @param {{ name: string, entry: string }} helper
 * @returns {import('vite').InlineConfig} one standalone ES module file in dist/helpers
 */
const helperViteConfig = (rootDir, build, { name, entry }) => ({
  configFile: false,
  root: rootDir,
  publicDir: false,
  logLevel: 'warn',
  mode: 'production',
  plugins: [noElectron(name)],
  resolve: { alias: appAliases(rootDir, build) },
  define: defineValues(build?.define, 'brock.config.ts'),
  ssr: { noExternal: true, target: 'node' },
  build: {
    ssr: entry,
    outDir: resolve(rootDir, HELPERS_OUT),
    emptyOutDir: false,
    target: HELPER_TARGET,
    minify: false,
    sourcemap: false,
    rollupOptions: { output: { format: 'es', entryFileNames: `${name}${HELPER_EXT}`, inlineDynamicImports: true } },
  },
});

export { helperViteConfig };
