/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { copyBrandIcons } from '../../icons/copy-brand-icons.mjs';
import { loadBrockConfig } from '../../load-config.mjs';
import { runBin } from '../../run.mjs';
import { WEB_VITE_CONFIG_FILE } from './web.constants.mjs';

/**
 * @param {string} rootDir
 * @param {'build' | 'dev'} mode
 * @param {string[]} [passthrough]
 * @returns {Promise<number>} vite's exit code
 */
const runWebVite = async (rootDir, mode, passthrough = []) => {
  if (!existsSync(join(rootDir, WEB_VITE_CONFIG_FILE))) {
    throw new Error(`${WEB_VITE_CONFIG_FILE} is missing. Add web or android to targets in brock.config.ts, then run brock sync.`);
  }
  copyBrandIcons(rootDir, await loadBrockConfig(rootDir));
  const args = mode === 'build' ? ['build', '--config', WEB_VITE_CONFIG_FILE] : ['--config', WEB_VITE_CONFIG_FILE];
  return runBin(rootDir, 'vite', [...args, ...passthrough]);
};

export { runWebVite };
