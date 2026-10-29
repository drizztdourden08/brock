/* @layer tooling-scripts @kind logic */
import { shareDeps } from './share-deps.mjs';

const tryShare = (config, rootDir) => {
  try {
    return shareDeps({ config, rootDir });
  } catch {
    return 'skipped';
  }
};

/**
 * @param {{ rootDir: string }} input the app root
 * @returns {import('vite').Plugin} restores the dependency pre-bundle from the build cache
 */
const sharedDepsCachePlugin = ({ rootDir }) => ({
  name: 'brock:shared-deps-cache',
  configResolved(config) {
    if (config.command !== 'serve' || config.optimizeDeps?.force) return;
    if (tryShare(config, rootDir) === 'seeded') config.logger.info('brock: restored the dependency pre-bundle from the build cache');
  },
});

export { sharedDepsCachePlugin };
