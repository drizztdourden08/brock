/* @layer tooling-scripts @kind logic */
import { brandIconsCurrent, writeBrandRecord } from './brand-icons-record.mjs';
import { ensureSyncedLater } from './ensure-synced.mjs';

const copyBrandIconsIfStale = async (appDir, label) => {
  if (brandIconsCurrent(appDir)) return;
  const [{ copyBrandIcons }, { loadBrockConfig }] = await Promise.all([import('../icons/copy-brand-icons.mjs'), import('../load-config.mjs')]);
  const copied = copyBrandIcons(appDir, await loadBrockConfig(appDir));
  if (copied?.written.length) console.log(`${label}: copied ${copied.written.length} brand icon file(s) into build/ and public/logos/`);
  writeBrandRecord(appDir, copied);
};

/**
 * @param {string} appDir
 * @param {string} [label] the command, for the log lines
 * @returns {Promise<{ problem: string | null, guide: () => Promise<void> }>} a reason to stop, and the guide to run later
 */
const syncIfStaleLater = async (appDir, label = 'brock sync') => {
  const { problem, guide } = await ensureSyncedLater(appDir, label);
  if (problem) return { problem, guide };
  await copyBrandIconsIfStale(appDir, label);
  return { problem: null, guide };
};

export { syncIfStaleLater };
