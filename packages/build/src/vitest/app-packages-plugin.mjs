/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';

const named = (id, names) => names.some((name) => id === name || id.startsWith(`${name}/`));

/**
 * @param {string} appDir the package that holds the shared packages
 * @param {string[]} names the packages every import must take from appDir
 * @returns {import('vite').Plugin} the plugin that resolves those from appDir
 */
const appPackagesPlugin = (appDir, names) => ({
  name: 'brock-vitest-app-packages',
  enforce: 'pre',
  resolveId(id, importer, options) {
    if (!named(id, names)) return null;
    return this.resolve(id, join(appDir, 'package.json'), { ...options, skipSelf: true });
  },
});

export { appPackagesPlugin };
