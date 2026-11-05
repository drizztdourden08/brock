/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { KIT_PACKAGE, KIT_VIA } from './apworld.constants.mjs';

/**
 * @param {string} rootDir The app root
 * @returns {Promise<{ buildApworldSet: Function, writeReleaseFiles: Function, serializeApworldIndex: Function }>}
 */
const loadKit = async (rootDir) => {
  const fromApp = createRequire(join(rootDir, 'package.json'));
  let from;
  try {
    from = createRequire(fromApp.resolve(KIT_VIA));
  } catch {
    from = fromApp;
  }
  let nodeEntry;
  try {
    nodeEntry = from.resolve(KIT_PACKAGE);
  } catch {
    throw new Error('Cannot find @drizztdourden08/archipelia-client-kit. Add @drizztdourden08/brock-randomizer (which depends on it) to the app.');
  }
  const node = await import(pathToFileURL(nodeEntry).href);
  const root = await import(pathToFileURL(join(dirname(nodeEntry), 'index.js')).href);
  return { buildApworldSet: node.buildApworldSet, writeReleaseFiles: node.writeReleaseFiles, serializeApworldIndex: root.serializeApworldIndex };
};

export { loadKit };
