/* @layer core @kind logic */
import type { RandomizerOptions } from '../../randomizer-options.type';
import type { OptionCatalog } from './option-catalog.type';

const frozenSettingsOf = (catalog: OptionCatalog, options: RandomizerOptions): Record<string, unknown> =>
  Object.fromEntries(catalog.filter((option) => option.frozen).map((option) => [option.key, options[option.key] ?? option.default]));

export { frozenSettingsOf };
