/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ProfileModeDef } from '@drizztdourden08/brock-react';

const randomizerMode: ProfileModeDef = {
  id: 'randomizer',
  label: msg('randomizer:mode.randomizer'),
  monogram: 'R',
  rank: 200,
  matches: (profile) => profile.randomizer?.mode === 'local',
};

export { randomizerMode };
