/* @layer electron-main @kind logic */
import type { ChooseDialogOptions } from './dialogs.type';
import { dialogText } from './dialog-text';
import { MAX_CHOICES, MIN_CHOICES } from './dialogs.constants';

const checkChoices = ({ title, choices, defaultId, cancelId }: ChooseDialogOptions): void => {
  const ids = choices.map((choice) => choice.id);
  const name = dialogText(title);
  if (ids.length < MIN_CHOICES || ids.length > MAX_CHOICES) {
    throw new Error(`choose dialog "${name}" needs ${MIN_CHOICES} to ${MAX_CHOICES} choices, got ${ids.length}`);
  }
  if (new Set(ids).size !== ids.length) throw new Error(`choose dialog "${name}" has duplicate choice ids`);
  if (!ids.includes(defaultId)) throw new Error(`choose dialog "${name}" defaultId "${defaultId}" is not a choice id`);
  if (!ids.includes(cancelId)) throw new Error(`choose dialog "${name}" cancelId "${cancelId}" is not a choice id`);
};

export { checkChoices };
