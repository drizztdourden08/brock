/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../import-from-app.mjs';
import { CORE_PACKAGE, SOURCE_SCOPE_PATTERN } from './look.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @returns {Promise<typeof import('@drizztdourden08/brock-core')>}  brock-core, run by the app's Vite
 */
const loadCore = async (rootDir) => {
  const vite = await importFromApp(rootDir, 'vite');
  const { module } = await vite.runnerImport(CORE_PACKAGE, {
    root: rootDir, configFile: false, logLevel: 'silent', ssr: { noExternal: [SOURCE_SCOPE_PATTERN] },
  });
  return module;
};

export { loadCore };
