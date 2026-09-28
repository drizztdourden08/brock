/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';

/**
 * @param {Omit<import('./index.d.mts').AddonPins, 'buildKey'>} versions
 * @returns {string} eight hex chars naming this exact build
 */
const buildKeyOf = ({ addonVersion, sdl3Version, libusbVersion }) =>
  createHash('sha256').update(`${addonVersion}|${sdl3Version}|${libusbVersion}`).digest('hex').slice(0, 8);

export { buildKeyOf };
