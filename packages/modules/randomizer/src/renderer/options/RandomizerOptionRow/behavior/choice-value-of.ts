/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../../world/types/rule-option-value.type';

const choiceValueOf = (option: OptionDef, picked: string): RuleOptionValue =>
  (option.choices ?? []).find((choice) => String(choice) === picked) ?? picked;

export { choiceValueOf };
