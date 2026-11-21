/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionDef } from '../../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../../world/types/rule-option-value.type';
import { optionKindOf } from '../../behavior/option-kind-of';

const readoutOf = (option: OptionDef, value: RuleOptionValue, text: (value: Text) => string): boolean | string => {
  const kind = optionKindOf(option);
  if (kind === 'toggle') return Boolean(value);
  const label = option.choiceLabels?.[String(value)];
  if (kind === 'choice') return label === undefined ? String(value) : text(label);
  return String(value);
};

export { readoutOf };
