/* @layer tooling-scripts @kind logic */
import { importFromApp } from './import-from-app.mjs';

/**
 * @param {string} rootDir
 * @returns {Promise<{ mergeConfig: Function, workspaceRootOf: Function, react: Function }>} the app's own vite and React plugin
 */
const appTools = async (rootDir) => {
  const [vite, reactPlugin] = await Promise.all([importFromApp(rootDir, 'vite'), importFromApp(rootDir, '@vitejs/plugin-react')]);
  return { mergeConfig: vite.mergeConfig, workspaceRootOf: vite.searchForWorkspaceRoot, react: reactPlugin.default };
};

export { appTools };
