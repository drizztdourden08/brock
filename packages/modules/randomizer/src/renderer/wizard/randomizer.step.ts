/* @layer renderer-shell @kind logic */
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import type { RandomizerFormState } from '../../contract/randomizer-form-state.type';
import { useRandomizerGameStore } from '../game-registry/randomizer-game-store';
import { buildOptionsSnapshot } from '../../world/options/build-options-snapshot';
import { RandomizerStepBody } from './RandomizerStepBody';
import { formOf } from './form-of';
import { optionsSliceOf } from './options-slice-of';
import { RANDOMIZER_SLICE, RANDOMIZER_STEP_ID, initialForm } from './wizard.constants';

const randomizerStep: ProfileWizardStepDef<RandomizerFormState> = {
  id: RANDOMIZER_STEP_ID,
  slice: RANDOMIZER_SLICE,
  initial: initialForm,
  step: {
    label: 'Randomizer',
    description: 'Randomize this profile with a seed.',
    when: () => useRandomizerGameStore.getState().game !== null,
    summary: (values) => (formOf(values).enabled ? `Seed ${formOf(values).seed || 'random'}` : 'Off'),
  },
  Body: RandomizerStepBody,
  toCreate: (form, values) => {
    const game = useRandomizerGameStore.getState().game;
    if (!game || !form.enabled) return {};
    const options = buildOptionsSnapshot(game.catalog ?? [], optionsSliceOf(values).overrides);
    return { randomizer: game.profile.toConfig(form, options) };
  },
};

export { randomizerStep };
