/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionDef } from '../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';

const valueText = (option: OptionDef, value: RuleOptionValue, text: (value: Text) => string): string => {
  if (typeof value === 'boolean') return value ? 'On' : 'Off';
  const label = option.choiceLabels?.[String(value)];
  return label === undefined ? String(value) : text(label);
};

export { valueText };
