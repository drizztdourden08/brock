/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { coordHome } from './coord-home.mjs';

const SWITCH_FILE = 'remote.json';

/**
 * @param {string} [home] the coord home
 * @returns {'local' | 'remote'}
 */
const remoteMode = (home = coordHome()) => {
  try {
    return JSON.parse(readFileSync(join(home, SWITCH_FILE), 'utf8')).mode === 'remote' ? 'remote' : 'local';
  } catch {
    return 'local';
  }
};

const isLocalMode = () => remoteMode() === 'local';

/**
 * @param {string} what the thing that would have gone to the remote
 * @returns {string} the plain line a verb prints in local mode
 */
const deferredNote = (what) => `Local mode: ${what} is deferred to replay on the owner's go. Nothing was sent. (${join(coordHome(), SWITCH_FILE)})`;

export { deferredNote, isLocalMode, remoteMode };
