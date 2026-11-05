/* @layer renderer-shell @kind logic */
import type { RandomizerProfileOptions } from '../../../../augment';
import type { OptionCatalog } from '../../../../world/options/option-catalog.type';
import type { RuleOptionValue } from '../../../../world/types/rule-option-value.type';
import { optionValuesOf } from '../../../options/behavior/option-values-of';

const runValuesOf = (catalog: OptionCatalog, options: RandomizerProfileOptions): Record<string, RuleOptionValue> =>
  optionValuesOf(catalog, Object.fromEntries(Object.entries(options)));

export { runValuesOf };
