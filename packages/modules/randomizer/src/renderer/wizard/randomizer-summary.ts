/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import { formOf } from './form-of';

const randomizerSummary = (values: ProfileWizardValues): Text => {
  const { enabled, seed } = formOf(values);
  if (!enabled) return msg('randomizer:wizard.step.summaryOff');
  return seed ? msg('randomizer:wizard.step.summarySeed', { seed }) : msg('randomizer:wizard.step.summaryRandom');
};

export { randomizerSummary };
