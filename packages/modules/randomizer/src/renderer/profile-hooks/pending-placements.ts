/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../augment';

const pendingPlacements = new WeakMap<RandomizerProfileConfig, unknown>();

export { pendingPlacements };
