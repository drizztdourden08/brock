/* @layer tooling-scripts @kind logic */
import { APWORLD_USAGE } from '../apworld/apworld.constants.mjs';
import { buildApworld } from '../apworld/build-apworld.mjs';
import { loadBrockConfig } from '../load-config.mjs';

/**
 * @param {{ rootDir: string, args?: string[], ap?: string[], data?: string, out?: string, module?: string, author?: string, public?: string }} ctx args are the words after apworld
 * @returns {Promise<number>} exit code
 */
const runApworld = async ({ rootDir, args = [], ...options }) => {
  if (args[0] !== 'build') {
    console.error(APWORLD_USAGE);
    return 1;
  }
  try {
    console.log(`brock apworld: ${await buildApworld(rootDir, await loadBrockConfig(rootDir), options)}`);
    return 0;
  } catch (error) {
    console.error(`brock apworld: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
};

export { runApworld };
