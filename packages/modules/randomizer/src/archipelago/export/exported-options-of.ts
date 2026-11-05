/* @layer core @kind logic */
import { choicesOf } from './choices-of';
import { PACKAGE_ROWS } from './export-options.constants';
import type { ApOptionDef, ExportedOption } from './export.type';

const rowOf = (option: ApOptionDef): ExportedOption => {
  const base = {
    key: option.key,
    displayName: option.displayName,
    description: option.description,
    default: option.baseline,
    locked: option.locked,
  };
  if (option.kind === 'choice') {
    return { ...base, type: 'choice', choices: choicesOf(option), numeric: typeof option.baseline === 'number' };
  }
  if (option.kind === 'range') return { ...base, type: 'range', range: option.range ?? { min: 0, max: 0 } };
  return { ...base, type: option.kind };
};

const exportedOptionsOf = (options: readonly ApOptionDef[]): ExportedOption[] => [
  ...options.map(rowOf),
  ...PACKAGE_ROWS,
];

export { exportedOptionsOf };
