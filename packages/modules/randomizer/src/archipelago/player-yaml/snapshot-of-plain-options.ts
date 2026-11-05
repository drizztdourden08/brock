/* @layer core @kind logic */
import { plainOptionValue } from './plain-option-value';
import type { OptionCatalog } from '../../world';
import type { RandomizerOptions } from '../../randomizer-options.type';

const snapshotOfPlainOptions = (
  catalog: OptionCatalog, plain: Readonly<Record<string, unknown>> = {},
): RandomizerOptions => {
  const byKey = new Map(catalog.map((option) => [option.key, option]));
  const unknown = Object.keys(plain).filter((key) => !byKey.has(key));
  if (unknown.length > 0) {
    const valid = [...byKey.keys()].sort().join(', ');
    throw new Error(`Unknown option${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}. Valid options: ${valid}.`);
  }
  const values: RandomizerOptions = Object.fromEntries(catalog.map((option) => [option.key, option.default]));
  for (const [key, raw] of Object.entries(plain)) {
    const option = byKey.get(key);
    if (option !== undefined) values[key] = plainOptionValue(option, raw);
  }
  return values;
};

export { snapshotOfPlainOptions };
