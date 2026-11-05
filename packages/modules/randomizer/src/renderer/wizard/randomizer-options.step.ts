/* @layer renderer-shell @kind logic */
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { buildOptionsSnapshot } from '../../world/options/build-options-snapshot';
import { optionSubStepsOf } from '../options/behavior/option-sub-steps-of';
import { OptionsStepBody } from './OptionsStepBody';
import { formOf } from './form-of';
import { optionsSliceOf } from './options-slice-of';
import type { RandomizerOptionsSlice } from './randomizer-form.type';
import { OPTIONS_SLICE, OPTIONS_STEP_ID, initialOptionsSlice } from './wizard.constants';

const randomizerOptionsStep: ProfileWizardStepDef<RandomizerOptionsSlice> = {
  id: OPTIONS_STEP_ID,
  slice: OPTIONS_SLICE,
  initial: initialOptionsSlice,
  step: {
    label: 'Options',
    description: 'Choose the randomizer options.',
    when: (values) => useRandomizerGameStore.getState().game !== null && formOf(values).enabled,
    subSteps: (values) => {
      const game = useRandomizerGameStore.getState().game;
      const overrides = optionsSliceOf(values).overrides;
      const legacy = game?.views?.optionSubSteps?.(buildOptionsSnapshot(game.catalog ?? [], overrides));
      return legacy ? legacy.map(({ id, label }) => ({ id, label })) : optionSubStepsOf(game, overrides);
    },
  },
  Body: OptionsStepBody,
};

export { randomizerOptionsStep };
