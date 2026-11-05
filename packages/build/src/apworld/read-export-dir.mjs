/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXPORT_FILES } from './apworld.constants.mjs';

/**
 * @param {string} dataDir The folder the game's export wrote
 * @returns {Record<string, unknown>} file name to parsed JSON, for the six exported files
 */
const readExportDir = (dataDir) => {
  const missing = EXPORT_FILES.filter((name) => !existsSync(join(dataDir, name)));
  if (missing.length) {
    throw new Error(`${dataDir} has no ${missing.join(', ')}. Write the export first (exportApWorld from @drizztdourden08/brock-randomizer/archipelago).`);
  }
  return Object.fromEntries(EXPORT_FILES.map((name) => [name, JSON.parse(readFileSync(join(dataDir, name), 'utf8'))]));
};

export { readExportDir };
