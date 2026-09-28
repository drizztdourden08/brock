/* @layer tooling-scripts @kind logic */
import { SNES_DEFAULTS } from './snes.constants.mjs';

/**
 * @param {'wasm' | 'roms' | 'states' | 'vault'} section
 * @param {{ snes?: Record<string, object> } | undefined} workspace
 * @param {object} [overrides]
 * @returns {Record<string, unknown>}
 */
const snesOptions = (section, workspace, overrides = {}) => ({
  ...SNES_DEFAULTS[section],
  ...(workspace?.snes?.[section] ?? {}),
  ...overrides,
});

export { snesOptions };
