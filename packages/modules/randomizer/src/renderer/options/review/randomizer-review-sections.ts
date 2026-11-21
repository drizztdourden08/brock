/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { englishText } from '../../../text/english-text';
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { WizardReviewSection } from '@drizztdourden08/tessera/composites';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { CONNECTION_STEP_ID } from '../../online/connection-step/connection.constants';
import { connectionShown } from '../../online/connection-step/connection-shown';
import { formOf } from '../../wizard/form-of';
import { optionsSliceOf } from '../../wizard/options-slice-of';
import { OPTIONS_STEP_ID, RANDOMIZER_STEP_ID } from '../../wizard/wizard.constants';
import { connectionReviewRows } from './connection-review-rows';
import { optionRows } from './option-rows';
import { randomizerRows } from './randomizer-rows';
import { REVIEW_TITLES } from './review.constants';

const randomizerReviewSections = (values: ProfileWizardValues, text: (value: Text) => string = englishText): WizardReviewSection[] => {
  const game = useRandomizerGameStore.getState().game;
  const form = formOf(values);
  const sections: WizardReviewSection[] = [
    { stepId: RANDOMIZER_STEP_ID, title: text(REVIEW_TITLES.randomizer), rows: randomizerRows(game, form, text) },
  ];
  if (!form.enabled) return sections;
  if (connectionShown(values)) {
    sections.push({ stepId: CONNECTION_STEP_ID, title: text(REVIEW_TITLES.connection), rows: connectionReviewRows(values, text) });
  }
  sections.push({ stepId: OPTIONS_STEP_ID, title: text(REVIEW_TITLES.options), rows: optionRows(game?.catalog ?? [], optionsSliceOf(values).overrides, text) });
  return sections;
};

export { randomizerReviewSections };
