/* @layer renderer-shell @kind logic */
import type { Hint } from '@drizztdourden08/tessera/primitives';
import type { SettingChoice } from '../../settings.type';
import { choiceOptions } from './choice-options';
import type { ChoiceRow } from './choice-rows.type';

const hintOf = (option: SettingChoice): Hint | undefined => {
  const text = choiceOptions.reasonOf(option) ?? option.hint;
  return text === undefined ? undefined : { label: option.label, description: text };
};

const choiceRows = (options: readonly SettingChoice[]): ChoiceRow[] =>
  options.map((option) => ({ value: option.value, label: option.label, disabled: choiceOptions.isOff(option), hint: hintOf(option) }));

export { choiceRows };
