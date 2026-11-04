/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import { useRandomizerGameStore } from '../game-registry/randomizer-game-store';
import { pendingPlacements } from './pending-placements';

const rollPendingPlacement = (config: RandomizerProfileConfig): void => {
  const game = useRandomizerGameStore.getState().game;
  if (!game || config.mode !== 'local') return;
  pendingPlacements.set(config, game.roll(config));
};

export { rollPendingPlacement };
