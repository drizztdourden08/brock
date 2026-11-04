/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { isLocalMode } from './is-local-mode';
import { pendingPlacements } from './pending-placements';

const rollPendingPlacement = (config: RandomizerProfileConfig): void => {
  const game = useRandomizerGameStore.getState().game;
  if (!game || !isLocalMode(config.mode)) return;
  pendingPlacements.set(config, game.roll(config));
};

export { rollPendingPlacement };
