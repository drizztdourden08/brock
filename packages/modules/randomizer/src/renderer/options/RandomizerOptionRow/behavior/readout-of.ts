/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../../world/types/rule-option-value.type';
import { optionKindOf } from '../../behavior/option-kind-of';

const readoutOf = (option: OptionDef, value: RuleOptionValue): boolean | string => {
  const kind = optionKindOf(option);
  if (kind === 'toggle') return Boolean(value);
  if (kind === 'choice') return option.choiceLabels?.[String(value)] ?? String(value);
  return String(value);
};

export { readoutOf };
