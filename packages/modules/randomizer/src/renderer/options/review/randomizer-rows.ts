/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerFormState } from '../../../contract/randomizer-form-state.type';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';
import { MODE_LABELS } from '../../wizard/wizard.constants';
import { REVIEW_LABELS, REVIEW_TITLES } from './review.constants';

const randomizerRows = (game: RegisteredGame | null, form: RandomizerFormState, text: (value: Text) => string): FactsPanelFact[] => [
  { label: text(REVIEW_TITLES.randomizer), value: text(form.enabled ? REVIEW_LABELS.on : REVIEW_LABELS.off) },
  ...(form.enabled
    ? [
      { label: text(REVIEW_LABELS.seed), value: form.seed.trim(), mono: true },
      { label: text(REVIEW_LABELS.mode), value: text(game?.labels?.modes?.[form.mode] ?? MODE_LABELS[form.mode] ?? form.mode) },
    ]
    : []),
];

export { randomizerRows };
