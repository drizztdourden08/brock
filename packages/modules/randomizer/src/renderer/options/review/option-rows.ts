/* @layer renderer-shell @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerOptions } from '../../../randomizer-options.type';
import type { OptionCatalog } from '../../../world/options/option-catalog.type';
import { optionValuesOf } from '../behavior/option-values-of';
import { ALL_DEFAULT_ROW } from './review.constants';
import { valueText } from './value-text';

const optionRows = (catalog: OptionCatalog, overrides: RandomizerOptions): FactsPanelFact[] => {
  const values = optionValuesOf(catalog, overrides);
  const rows = catalog
    .filter((option) => !option.frozen && option.key in values && values[option.key] !== option.default)
    .map((option) => ({
      label: option.section ? `${option.section}: ${option.label}` : option.label,
      value: valueText(option, values[option.key] ?? ''),
    }));
  return rows.length === 0 ? [ALL_DEFAULT_ROW] : rows;
};

export { optionRows };
