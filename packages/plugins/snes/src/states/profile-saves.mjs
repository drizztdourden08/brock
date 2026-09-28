/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { readJson } from '../read-json.mjs';
import { walkFiles } from '../walk-files.mjs';

/**
 * @param {{ userData: string, name: string }} worktree
 * @param {{ profilesDir: string }} states
 * @returns {string}
 */
const profileDirOf = (worktree, states) => join(worktree.userData, states.profilesDir, worktree.name);

/**
 * @param {string} profileDir
 * @param {{ savesDir: string, manualDir: string }} states
 * @returns {string[]} the manual save names the profile's manifest lists
 */
const manualSaveNames = (profileDir, states) => {
  const entries = readJson(join(profileDir, states.savesDir, states.manualDir, 'manifest.json'), []);
  return Array.isArray(entries) ? entries.map((entry) => entry?.name).filter(Boolean) : [];
};

/**
 * @param {string} profileDir
 * @param {{ savesDir: string }} states
 * @returns {number[]} the quick slot numbers present, ascending
 */
const quickSlots = (profileDir, states) => {
  const found = [];
  walkFiles(join(profileDir, states.savesDir), (_file, name) => {
    const slot = name.match(/^save(\d+)\.sav$/i);
    if (slot) found.push(Number(slot[1]));
  });
  return found.sort((a, b) => a - b);
};

export { manualSaveNames, profileDirOf, quickSlots };
