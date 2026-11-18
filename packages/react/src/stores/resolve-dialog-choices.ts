/* @layer renderer-shell @kind logic */
import { controlSources } from '../app/control-sources';
import type { DialogChoice, DialogChoiceInput } from './dialog.type';

const resolveDialogChoices = (choices: readonly DialogChoiceInput[]): DialogChoice[] => {
  const { text } = controlSources.get();
  return choices.map(({ value, label, description }) => ({
    value,
    label: text(label),
    ...(description === undefined ? {} : { description: text(description) }),
  }));
};

export { resolveDialogChoices };
