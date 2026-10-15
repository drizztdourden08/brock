/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../import-from-app.mjs';
import { LOOK_CORE_ENTRY, LOOK_CORE_SOURCE, SOURCE_SCOPE_PATTERN } from './look.constants.mjs';

const RESOLVED_ENTRY = `\0${LOOK_CORE_ENTRY}`;

const lookCoreEntry = () => ({
  name: 'brock-look-core',
  resolveId: (id) => (id === LOOK_CORE_ENTRY ? RESOLVED_ENTRY : null),
  load: (id) => (id === RESOLVED_ENTRY ? LOOK_CORE_SOURCE : null),
});

/**
 * @param {string} rootDir  The app root
 * @returns {Promise<Pick<typeof import('@drizztdourden08/brock-core'), 'defineProduct' | 'resolveLook' | 'darkPair'>>}  run by the app's Vite
 */
const loadCore = async (rootDir) => {
  const vite = await importFromApp(rootDir, 'vite');
  const { module } = await vite.runnerImport(LOOK_CORE_ENTRY, {
    root: rootDir, configFile: false, logLevel: 'silent', ssr: { noExternal: [SOURCE_SCOPE_PATTERN] }, plugins: [lookCoreEntry()],
  });
  return module;
};

export { loadCore };
