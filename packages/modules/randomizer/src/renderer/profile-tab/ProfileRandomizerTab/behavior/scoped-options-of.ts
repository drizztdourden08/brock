/* @layer renderer-shell @kind logic */
import type { OptionCatalog } from '../../../../world/options/option-catalog.type';
import type { OptionDef } from '../../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../../world/types/rule-option-value.type';
import type { OptionScope } from './option-scope.type';

const differs = (option: OptionDef, values: Readonly<Record<string, RuleOptionValue>>): boolean =>
  option.key in values && values[option.key] !== option.default;

const scopedOptionsOf = (
  catalog: OptionCatalog,
  values: Readonly<Record<string, RuleOptionValue>>,
  scope: OptionScope,
): OptionDef[] => catalog.filter((option) => !option.frozen && (scope === 'all' || differs(option, values)));

export { scopedOptionsOf };
