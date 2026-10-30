/* @layer tooling-scripts @kind logic */
import { PLUGIN_NAME } from './shared-deps-cache.constants.mjs';
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
const sharedDepsCachePlugin = ({ rootDir }) => {
  const api = { outcome: 'idle' };
  return {
    name: PLUGIN_NAME,
    api,
    configResolved(config) {
      if (config.command !== 'serve' || config.optimizeDeps?.force) return;
      api.outcome = tryShare(config, rootDir);
      if (api.outcome === 'seeded') config.logger.info('brock: restored the dependency pre-bundle from the build cache');
    },
  };
};

/**
 * @param {import('vite').ResolvedConfig} config a config the plugin resolved
 * @returns {boolean} a current pre-bundle is in place for this worktree
 */
const depsReady = (config) => ['seeded', 'present'].includes(config.plugins.find((plugin) => plugin.name === PLUGIN_NAME)?.api?.outcome);

export { depsReady, sharedDepsCachePlugin };
