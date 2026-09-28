/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { readJson } from '../read-json.mjs';
import { writeJson } from '../write-json.mjs';

/**
 * @param {string} file the state file path
 * @param {(message: string) => void} log
 * @returns {Record<string, string>} the base recorded by the last sync
 */
const readVaultState = (file, log) => {
  if (!existsSync(file)) return {};
  const state = readJson(file, null);
  if (!state) {
    log(`${file} is unreadable, so this counts as a first sync.`);
    return {};
  }
  return state.files ?? {};
};

/**
 * @param {string} file
 * @param {Record<string, string>} files
 * @param {string} vaultDir
 * @returns {void}
 */
const writeVaultState = (file, files, vaultDir) => {
  writeJson(file, { syncedAt: Date.now(), vaultDir, files });
};

export { readVaultState, writeVaultState };
