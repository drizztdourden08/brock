/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { DEPS_METADATA_ENV, ELECTRON_VITE_MODE_ENV } from './optimize-deps.constants.mjs';
import { optimizeDepsOptions, rendererOptimizeDeps } from './renderer-optimize-deps.mjs';

/**
 * @param {{ rootDir: string, aliases: Record<string, string>, options: unknown }} input the app root, its aliases and build.optimizeDeps
 * @returns {import('vite').Plugin} the dev server optimizeDeps and metadata path
 */
const optimizeDepsPlugin = ({ rootDir, aliases, options }) => {
  optimizeDepsOptions(options);
  const start = () => rendererOptimizeDeps(rootDir, aliases, options);
  let pending = process.env[ELECTRON_VITE_MODE_ENV] === 'development' ? start() : null;
  pending?.catch(() => null);
  return {
    name: 'brock:optimize-deps',
    config: async (_config, { command }) => {
      if (command !== 'serve') return null;
      pending ??= start();
      return { optimizeDeps: await pending };
    },
    configResolved: (config) => {
      if (config.command === 'serve') process.env[DEPS_METADATA_ENV] = join(config.cacheDir, 'deps', '_metadata.json');
    },
  };
};

export { optimizeDepsPlugin };
