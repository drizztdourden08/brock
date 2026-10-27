/* @layer tooling-scripts @kind logic */
import { existsSync, utimesSync } from 'node:fs';
import { join } from 'node:path';
import { MANIFEST_FILE } from './freshness.constants.mjs';
import { rendererEntryProblem } from './renderer-entry-problem.mjs';
import { syncStaleReason } from './sync-stale-reason.mjs';
import { tesseraMismatch } from './tessera-mismatch.mjs';

const syncNow = async (appDir, label, reason) => {
  console.log(`${label}: running brock sync first, since ${reason}.`);
  const [{ loadBrockConfig }, { syncApp }, { workflowInputs }] = await Promise.all([
    import('../load-config.mjs'),
    import('../modules/sync.mjs'),
    import('../release/workspace-workflow-inputs.mjs'),
  ]);
  const result = syncApp(appDir, await loadBrockConfig(appDir), await workflowInputs(appDir));
  for (const path of result.written) console.log(`  ${path}`);
  const manifest = join(appDir, MANIFEST_FILE);
  const now = new Date();
  if (existsSync(manifest)) utimesSync(manifest, now, now);
};

const writeGuideLater = async (appDir, label) => {
  const { writeGuide } = await import('../tessera/write-guide.mjs');
  return writeGuide(appDir, { label, missingOnly: true });
};

/**
 * @param {string} appDir
 * @param {string} label the command, for the log lines
 * @returns {Promise<{ problem: string | null, guide: () => Promise<void> }>} a reason to stop, and the guide to run later
 */
const ensureSyncedLater = async (appDir, label) => {
  const mismatch = tesseraMismatch(appDir);
  if (mismatch) return { problem: mismatch.line, guide: () => Promise.resolve() };
  const reason = syncStaleReason(appDir);
  if (reason) await syncNow(appDir, label, reason);
  return { problem: rendererEntryProblem(appDir), guide: () => writeGuideLater(appDir, label) };
};

/**
 * @param {string} appDir
 * @param {string} label the command, for the log lines
 * @returns {Promise<string | null>} a reason to stop before the renderer starts, or null
 */
const ensureSynced = async (appDir, label) => {
  const mismatch = tesseraMismatch(appDir);
  if (mismatch) return mismatch.line;
  const { guide } = await ensureSyncedLater(appDir, label);
  await guide();
  return rendererEntryProblem(appDir);
};

export { ensureSynced, ensureSyncedLater };
