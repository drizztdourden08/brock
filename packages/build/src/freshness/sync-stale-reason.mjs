/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { MANIFEST_FILE, SYNC_INPUTS } from './freshness.constants.mjs';
import { newestChange } from './newest-change.mjs';

/**
 * @param {string} appDir
 * @returns {string | null} why `.brock` needs a sync, or null when it is current
 */
const syncStaleReason = (appDir) => {
  const manifest = join(appDir, MANIFEST_FILE);
  if (!existsSync(manifest)) return `${MANIFEST_FILE} is missing`;
  const written = statSync(manifest).mtimeMs;
  const changed = SYNC_INPUTS.find((input) => newestChange(join(appDir, input)) > written);
  return changed ? `${changed} changed since the last sync` : null;
};

export { syncStaleReason };
