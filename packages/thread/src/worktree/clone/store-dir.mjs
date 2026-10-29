/* @layer tooling-scripts @kind logic */
import { homedir } from 'node:os';
import { join, parse, resolve } from 'node:path';
import { STORE_ENV, STORE_HOME_FOLDERS, STORE_VOLUME_FOLDERS } from './clone.constants.mjs';

const volumeOf = (path) => parse(resolve(path)).root.toLowerCase();

/**
 * The shared package folders live on the volume of the checkout, so their files can be hardlinks.
 * @param {string} near a checkout the store will serve
 * @returns {string} BROCK_MODULES_STORE_DIR, else ~/.brock/cache/node-modules on the same volume, else <volume>/.brock-store/node-modules
 */
const modulesStoreRoot = (near) => {
  if (process.env[STORE_ENV]) return resolve(process.env[STORE_ENV]);
  const home = homedir();
  if (volumeOf(home) === volumeOf(near)) return join(home, ...STORE_HOME_FOLDERS);
  return join(parse(resolve(near)).root, ...STORE_VOLUME_FOLDERS);
};

export { modulesStoreRoot };
