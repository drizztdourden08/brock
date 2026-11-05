/* @layer renderer-shell @kind logic */
import type { CreateProfileOptions } from '@drizztdourden08/brock-core';
import type { RandomizerProfileConfig } from '../../augment';
import type { RollContext } from '../../contract/roll-context.type';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { ONLINE_MODE } from '../online/online-mode.constants';
import { pendingPlacements } from './pending-placements';
import { useRollProgress } from './roll-progress';

const rollPendingPlacement = async (config: RandomizerProfileConfig, create: CreateProfileOptions): Promise<void> => {
  const game = useRandomizerGameStore.getState().game;
  if (!game || config.mode === ONLINE_MODE) return;
  const { report } = useRollProgress.getState();
  const ctx: RollContext = { create, mode: config.mode, connection: create.randomizerConnection, onProgress: report };
  try {
    pendingPlacements.set(config, await game.roll(config, ctx));
  } finally {
    report(null);
  }
};

export { rollPendingPlacement };
