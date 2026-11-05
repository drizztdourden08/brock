/* @layer renderer-shell @kind logic */
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';
import type { OptionCatalog } from '../../../world/options/option-catalog.type';

const changedCountOf = (
  catalog: OptionCatalog,
  values: Readonly<Record<string, RuleOptionValue>>,
  keys: readonly string[] | undefined,
): number =>
  catalog.filter((option) => keys?.includes(option.key) === true && !option.frozen && values[option.key] !== option.default).length;

export { changedCountOf };
