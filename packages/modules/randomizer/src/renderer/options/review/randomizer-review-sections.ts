/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { WizardReviewSection } from '@drizztdourden08/tessera/composites';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { ONLINE_MODE } from '../../online/online-mode.constants';
import { CONNECTION_STEP_ID } from '../../online/connection-step/connection.constants';
import { connectionOfValues } from '../../online/connection-step/connection-of-values';
import { formOf } from '../../wizard/form-of';
import { optionsSliceOf } from '../../wizard/options-slice-of';
import { OPTIONS_STEP_ID, RANDOMIZER_STEP_ID } from '../../wizard/wizard.constants';
import { connectionRows } from './connection-rows';
import { optionRows } from './option-rows';
import { randomizerRows } from './randomizer-rows';
import { REVIEW_TITLES } from './review.constants';

const randomizerReviewSections = (values: ProfileWizardValues): WizardReviewSection[] => {
  const game = useRandomizerGameStore.getState().game;
  const form = formOf(values);
  const sections: WizardReviewSection[] = [
    { stepId: RANDOMIZER_STEP_ID, title: REVIEW_TITLES.randomizer, rows: randomizerRows(game, form) },
  ];
  if (!form.enabled) return sections;
  if (game?.archipelago !== undefined && form.mode === ONLINE_MODE) {
    sections.push({ stepId: CONNECTION_STEP_ID, title: REVIEW_TITLES.connection, rows: connectionRows(connectionOfValues(values)) });
  }
  sections.push({ stepId: OPTIONS_STEP_ID, title: REVIEW_TITLES.options, rows: optionRows(game?.catalog ?? [], optionsSliceOf(values).overrides) });
  return sections;
};

export { randomizerReviewSections };
