/* @layer renderer-shell @kind logic */
import type { RandomizerOptions } from '../../../randomizer-options.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';
import type { OptionCatalog } from '../../../world/options/option-catalog.type';
import { buildOptionsSnapshot } from '../../../world/options/build-options-snapshot';

const isRuleOptionValue = (value: unknown): value is RuleOptionValue =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const optionValuesOf = (catalog: OptionCatalog, overrides: RandomizerOptions): Record<string, RuleOptionValue> => {
  const values: Record<string, RuleOptionValue> = {};
  for (const [key, value] of Object.entries(buildOptionsSnapshot(catalog, overrides))) {
    if (isRuleOptionValue(value)) values[key] = value;
  }
  return values;
};

export { optionValuesOf };
