/* @layer tooling-scripts @kind logic */
import { existsSync, utimesSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { syncApp } from '../modules/sync.mjs';
import { MANIFEST_FILE } from './freshness.constants.mjs';
import { rendererEntryProblem } from './renderer-entry-problem.mjs';
import { syncStaleReason } from './sync-stale-reason.mjs';

/**
 * @param {string} appDir
 * @param {string} label the command, for the log lines
 * @returns {Promise<string | null>} a reason to stop before the renderer starts, or null
 */
const ensureSynced = async (appDir, label) => {
  const reason = syncStaleReason(appDir);
  if (reason) {
    console.log(`${label}: running brock sync first, since ${reason}.`);
    const result = syncApp(appDir, await loadBrockConfig(appDir));
    for (const path of result.written) console.log(`  ${path}`);
    const manifest = join(appDir, MANIFEST_FILE);
    const now = new Date();
    if (existsSync(manifest)) utimesSync(manifest, now, now);
  }
  return rendererEntryProblem(appDir);
};

export { ensureSynced };
