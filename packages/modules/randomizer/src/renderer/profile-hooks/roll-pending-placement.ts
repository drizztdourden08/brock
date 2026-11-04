/* @layer renderer-shell @kind logic */
import type { CreateProfileOptions } from '@drizztdourden08/brock-core';
import type { RandomizerProfileConfig } from '../../augment';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { isLocalMode } from './is-local-mode';
import { pendingPlacements } from './pending-placements';

const rollPendingPlacement = async (config: RandomizerProfileConfig, create: CreateProfileOptions): Promise<void> => {
  const game = useRandomizerGameStore.getState().game;
  if (!game || !isLocalMode(config.mode)) return;
  pendingPlacements.set(config, await game.roll(config, { create }));
};

export { rollPendingPlacement };
