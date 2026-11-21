/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerOptions } from '../../../randomizer-options.type';
import type { OptionCatalog } from '../../../world/options/option-catalog.type';
import { optionValuesOf } from '../behavior/option-values-of';
import { ALL_DEFAULT_ROW } from './review.constants';
import { valueText } from './value-text';

const optionRows = (catalog: OptionCatalog, overrides: RandomizerOptions, text: (value: Text) => string): FactsPanelFact[] => {
  const values = optionValuesOf(catalog, overrides);
  const rows = catalog
    .filter((option) => !option.frozen && option.key in values && values[option.key] !== option.default)
    .map((option) => ({
      label: option.section ? `${option.section}: ${text(option.label)}` : text(option.label),
      value: valueText(option, values[option.key] ?? '', text),
    }));
  return rows.length === 0 ? [{ label: text(ALL_DEFAULT_ROW.label), value: text(ALL_DEFAULT_ROW.value) }] : rows;
};

export { optionRows };
