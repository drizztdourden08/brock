/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import type { RandomizerFormState } from '../../contract/randomizer-form-state.type';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { buildOptionsSnapshot } from '../../world/options/build-options-snapshot';
import { connectionShown } from '../online/connection-step/connection-shown';
import { connectionValuesOf } from '../online/connection-step/connection-values-of';
import { withConnection } from '../online/connection-step/with-connection';
import { RandomizerStepBody } from './RandomizerStepBody';
import { formOf } from './form-of';
import { optionsSliceOf } from './options-slice-of';
import { randomizerSummary } from './randomizer-summary';
import { RANDOMIZER_SLICE, RANDOMIZER_STEP_ID, initialForm } from './wizard.constants';

const randomizerStep: ProfileWizardStepDef<RandomizerFormState> = {
  id: RANDOMIZER_STEP_ID,
  slice: RANDOMIZER_SLICE,
  initial: initialForm,
  step: {
    label: msg('randomizer:wizard.step.label'),
    description: msg('randomizer:wizard.step.description'),
    when: () => useRandomizerGameStore.getState().game !== null,
    summary: randomizerSummary,
  },
  Body: RandomizerStepBody,
  toCreate: (form, values) => {
    const game = useRandomizerGameStore.getState().game;
    if (!game || !form.enabled) return {};
    const options = buildOptionsSnapshot(game.catalog ?? [], optionsSliceOf(values).overrides);
    const randomizer = withConnection(game.profile.toConfig(form, options, values), values);
    return connectionShown(values) ? { randomizer, randomizerConnection: connectionValuesOf(values) } : { randomizer };
  },
};

export { randomizerStep };
