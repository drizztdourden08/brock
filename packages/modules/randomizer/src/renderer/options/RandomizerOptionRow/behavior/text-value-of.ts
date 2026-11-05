/* @layer renderer-shell @kind logic */
import type { RuleOptionValue } from '../../../../world/types/rule-option-value.type';

const textValueOf = (current: RuleOptionValue, typed: string): RuleOptionValue =>
  (typeof current === 'number' ? Number(typed) : typed);

export { textValueOf };
