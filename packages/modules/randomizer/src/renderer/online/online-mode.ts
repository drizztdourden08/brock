/* @layer renderer-shell @kind logic */
import type { ProfileModeDef } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { ONLINE_MODE, ONLINE_MODE_BADGE, ONLINE_MODE_LABEL, ONLINE_MODE_RANK } from './online-mode.constants';

const randomizerOnlineMode: ProfileModeDef = {
  id: 'randomizer-online',
  get label() {
    return useRandomizerGameStore.getState().game?.labels?.modes?.online ?? ONLINE_MODE_LABEL;
  },
  monogram: ONLINE_MODE_BADGE,
  rank: ONLINE_MODE_RANK,
  matches: (profile) =>
    profile.randomizer?.mode === ONLINE_MODE && useRandomizerGameStore.getState().game?.archipelago !== undefined,
};

export { randomizerOnlineMode };
