/* @layer renderer-shell @kind logic */
import type { ProfileModeDef } from '@drizztdourden08/brock-react';

const randomizerMode: ProfileModeDef = {
  id: 'randomizer',
  label: 'Randomizer',
  monogram: 'R',
  rank: 200,
  matches: (profile) => profile.randomizer?.mode === 'local',
};

export { randomizerMode };
