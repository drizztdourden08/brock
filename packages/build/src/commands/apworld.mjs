/* @layer tooling-scripts @kind logic */
import { APWORLD_USAGE } from '../apworld/apworld.constants.mjs';
import { buildApworld } from '../apworld/build-apworld.mjs';
import { ensureApworld } from '../apworld/ensure-apworld.mjs';
import { exportApworld } from '../apworld/export-apworld.mjs';
import { writePlayerFile } from '../apworld/write-player-file.mjs';
import { loadBrockConfig } from '../load-config.mjs';

const VERBS = {
  build: (rootDir, options) => loadBrockConfig(rootDir).then((config) => buildApworld(rootDir, config, options)),
  export: (rootDir, options) => exportApworld(rootDir, options),
  refresh: (rootDir, options) => loadBrockConfig(rootDir).then((config) => ensureApworld(rootDir, config, options)),
  'player-file': (rootDir, options) => writePlayerFile(rootDir, options),
};

/**
 * @param {{ rootDir: string, args?: string[] }} ctx
 * @returns {Promise<number>} exit code
 */
const runApworld = async ({ rootDir, args = [], ...options }) => {
  const verb = VERBS[args[0]];
  if (!verb) {
    console.error(APWORLD_USAGE);
    return 1;
  }
  try {
    console.log(`brock apworld: ${await verb(rootDir, options)}`);
    return 0;
  } catch (error) {
    console.error(`brock apworld: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
};

export { runApworld };
