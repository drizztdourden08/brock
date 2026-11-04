/* @layer core @kind logic */
import type { RandomizerOptions } from '../../augment';
import type { OptionCatalog } from './option-catalog.type';

const buildOptionsSnapshot = (catalog: OptionCatalog, overrides: RandomizerOptions = {}): RandomizerOptions => {
  const values: RandomizerOptions = {};
  for (const option of catalog) {
    const overridden = !option.frozen && Object.hasOwn(overrides, option.key);
    values[option.key] = overridden ? overrides[option.key] : option.default;
  }
  return values;
};

export { buildOptionsSnapshot };
