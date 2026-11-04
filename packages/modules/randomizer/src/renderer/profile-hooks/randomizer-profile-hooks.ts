/* @layer renderer-shell @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { writePlacement } from '../../session/placement/write-placement';
import { mergeFrozenSettings } from './merge-frozen-settings';
import { pendingPlacements } from './pending-placements';
import { rollPendingPlacement } from './roll-pending-placement';

const randomizerProfileHooks: ProfileStoreHooks = {
  patchable: ['randomizer'],
  build: (opts) => {
    if (!opts.randomizer) return {};
    rollPendingPlacement(opts.randomizer);
    return { randomizer: opts.randomizer };
  },
  onCreate: async (profile, files) => {
    const config = profile.randomizer;
    if (!config) return;
    const game = useRandomizerGameStore.getState().game;
    if (game && pendingPlacements.has(config)) {
      await writePlacement(game, profile.id, pendingPlacements.get(config));
      pendingPlacements.delete(config);
    }
    await mergeFrozenSettings(files, profile.id, config.frozenSettings);
  },
};

export { randomizerProfileHooks };
