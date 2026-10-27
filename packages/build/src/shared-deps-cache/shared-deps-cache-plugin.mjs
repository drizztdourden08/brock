/* @layer tooling-scripts @kind logic */
import { shareDeps } from './share-deps.mjs';

const tryShare = (config, rootDir, sharedRoot) => {
  try {
    return shareDeps({ config, rootDir, sharedRoot });
  } catch {
    return 'skipped';
  }
};

/**
 * @param {{ rootDir: string, sharedRoot?: string }} input the app root and the shared folder
 * @returns {import('vite').Plugin} shares the dependency cache between worktrees
 */
const sharedDepsCachePlugin = ({ rootDir, sharedRoot }) => ({
  name: 'brock:shared-deps-cache',
  configResolved(config) {
    if (config.command !== 'serve' || config.optimizeDeps?.force) return;
    if (tryShare(config, rootDir, sharedRoot) === 'seeded') config.logger.info('brock: reused the dependency cache of another worktree');
  },
});

export { sharedDepsCachePlugin };
