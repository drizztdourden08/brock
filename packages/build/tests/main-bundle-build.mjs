/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { build } from 'vite';
import { buildReusePlugin } from '../src/build-reuse/build-reuse-plugin.mjs';

/**
 * @param {string} root an app folder with electron/main.js
 * @param {import('vite').Logger} customLogger where Vite and the reuse plugin say what they did
 * @returns {Promise<unknown>} builds the main bundle with the reuse plugin
 */
const buildMain = (root, customLogger) => build({
  root,
  configFile: false,
  logLevel: 'info',
  customLogger,
  plugins: [buildReusePlugin({ rootDir: root, target: 'main' })],
  build: { outDir: join(root, 'dist/electron'), emptyOutDir: true, minify: false, lib: { entry: { main: join(root, 'electron/main.js') }, formats: ['es'] } },
});

export { buildMain };
