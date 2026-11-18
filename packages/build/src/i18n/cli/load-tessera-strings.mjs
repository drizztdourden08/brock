/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../../import-from-app.mjs';
import { SOURCE_SCOPE_PATTERN } from '../../look/look.constants.mjs';
import { TESSERA_STRINGS_ENTRY } from './cli.constants.mjs';

/**
 * @param {string} rootDir a folder that resolves vite and Tessera
 * @returns {Promise<{ strings: Record<string, Record<string, unknown>>, params: Record<string, Record<string, string[]>> }>} the installed Tessera strings and their param names
 */
const loadTesseraStrings = async (rootDir) => {
  const vite = await importFromApp(rootDir, 'vite');
  const { module } = await vite.runnerImport(TESSERA_STRINGS_ENTRY, {
    root: rootDir, configFile: false, logLevel: 'silent', ssr: { noExternal: [SOURCE_SCOPE_PATTERN] },
  });
  return { strings: module.TESSERA_STRINGS, params: module.TESSERA_STRING_PARAMS ?? {} };
};

export { loadTesseraStrings };
