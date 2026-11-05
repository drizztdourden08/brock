/* @layer renderer-shell @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerFormState } from '../../../contract/randomizer-form-state.type';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';
import { MODE_LABELS } from '../../wizard/wizard.constants';

const randomizerRows = (game: RegisteredGame | null, form: RandomizerFormState): FactsPanelFact[] => [
  { label: 'Randomizer', value: form.enabled ? 'On' : 'Off' },
  ...(form.enabled
    ? [
      { label: 'Seed', value: form.seed.trim(), mono: true },
      { label: 'Mode', value: game?.labels?.modes?.[form.mode] ?? MODE_LABELS[form.mode] ?? form.mode },
    ]
    : []),
];

export { randomizerRows };
