/* @layer core @kind logic */
import { WHOLE_NUMBER } from './export-options.constants';
import type { ApOptionDef, ExportedOption } from './export.type';

const choicesOf = (option: Pick<ApOptionDef, 'key' | 'choices'>): ExportedOption['choices'] => {
  const values = (option.choices ?? []).map((choice) => choice.value);
  const whole = values.every((value) => WHOLE_NUMBER.test(value));
  const lowered = new Set(values.map((value) => value.toLowerCase()));
  if (lowered.size !== values.length) throw new Error(`choice values differ only by case: ${option.key}`);
  return values.map((value, index) => ({ value, id: whole ? Number(value) : index }));
};

export { choicesOf };
