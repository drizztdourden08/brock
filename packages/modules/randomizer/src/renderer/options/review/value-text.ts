/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';

const valueText = (option: OptionDef, value: RuleOptionValue): string => {
  if (typeof value === 'boolean') return value ? 'On' : 'Off';
  return option.choiceLabels?.[String(value)] ?? String(value);
};

export { valueText };
