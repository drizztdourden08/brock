/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const importFromApp = (rootDir, name) => {
  const appRequire = createRequire(join(rootDir, 'package.json'));
  return import(pathToFileURL(appRequire.resolve(name)).href);
};

/**
 * @param {string} rootDir
 * @returns {Promise<{ mergeConfig: Function, workspaceRootOf: Function, react: Function }>} the app's own vite and React plugin
 */
const appTools = async (rootDir) => {
  const [vite, reactPlugin] = await Promise.all([importFromApp(rootDir, 'vite'), importFromApp(rootDir, '@vitejs/plugin-react')]);
  return { mergeConfig: vite.mergeConfig, workspaceRootOf: vite.searchForWorkspaceRoot, react: reactPlugin.default };
};

export { appTools };
