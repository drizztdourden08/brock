/* @layer renderer-shell @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { mergeFrozenSettings } from './merge-frozen-settings';
import { rollPendingPlacement } from './roll-pending-placement';
import { settlePendingRoll } from './settle-pending-roll';

const randomizerProfileHooks: ProfileStoreHooks = {
  patchable: ['randomizer'],
  build: async (opts) => {
    if (!opts.randomizer) return {};
    await rollPendingPlacement(opts.randomizer, opts);
    return { randomizer: opts.randomizer };
  },
  onCreate: async (profile, files) => {
    const config = profile.randomizer;
    if (!config) return;
    await mergeFrozenSettings(files, profile.id, config.frozenSettings);
    const game = useRandomizerGameStore.getState().game;
    if (game) await settlePendingRoll(game, profile.id, config);
  },
};

export { randomizerProfileHooks };
