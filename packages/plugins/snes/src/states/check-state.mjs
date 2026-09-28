/* @layer tooling-scripts @kind logic */
import { snesOptions } from '../snes-options.mjs';
import { manualSaveNames, profileDirOf, quickSlots } from './profile-saves.mjs';

const BOOT_STATES = new Set(['none', 'game']);

const quickSlotRefusal = ({ state, name, profileDir, states }) => {
  const slots = quickSlots(profileDir, states);
  if (slots.includes(Number(state))) return null;
  const present = slots.length > 0 ? `slots present: ${slots.join(', ')}.` : 'this profile has no quick saves.';
  return `quick slot ${state} does not exist in "${name}": ${present} A long-lived test loads a named manual save; quick slots get overwritten.`;
};

const manualSaveRefusal = ({ state, name, profileDir, states }) => {
  const names = manualSaveNames(profileDir, states);
  if (names.includes(state)) return null;
  const present = names.length > 0 ? `Manual saves: ${names.join(', ')}.` : 'This profile has no manual saves.';
  return `"${state}" is not a save in "${name}". ${present} Pass "game" to boot the game, or "none" for the app alone.`;
};

/**
 * @param {{ userData: string, name: string, workspace?: object }} worktree
 * @param {string} state a save name, a quick slot number, `game` or `none`
 * @param {object} [overrides] states options
 * @returns {string | null} why the state cannot load, or null when it exists
 */
const checkState = (worktree, state, overrides = {}) => {
  if (BOOT_STATES.has(state)) return null;
  const states = snesOptions('states', worktree.workspace, overrides);
  const request = { state, name: worktree.name, profileDir: profileDirOf(worktree, states), states };
  return /^\d+$/.test(state) ? quickSlotRefusal(request) : manualSaveRefusal(request);
};

export { checkState };
