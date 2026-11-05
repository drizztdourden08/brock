/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { importFromApp } from '../import-from-app.mjs';

/**
 * @param {string} rootDir The app root
 * @returns {Promise<any>} a Vite server that only loads modules
 */
const startLoader = async (rootDir) => {
  const vite = await importFromApp(rootDir, 'vite');
  return vite.createServer({
    root: rootDir,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
};

/**
 * @param {string} rootDir The app root
 * @param {{ entry?: string, fn?: string }} options The TypeScript file and the name of the function it exports
 * @param {unknown} input The one argument the function gets
 * @returns {Promise<any>} what the function returned
 */
const callEntry = async (rootDir, options, input) => {
  const { entry, fn } = options;
  if (!entry || !fn) throw new Error('give the game entry and the function it exports: --entry <ts file> --fn <export name>');
  const server = await startLoader(rootDir);
  try {
    const loaded = await server.ssrLoadModule(resolve(rootDir, entry).replaceAll('\\', '/'));
    if (typeof loaded[fn] !== 'function') throw new Error(`${entry} has no function export named ${fn}`);
    return await loaded[fn](input);
  } finally {
    await server.close();
  }
};

export { callEntry };
