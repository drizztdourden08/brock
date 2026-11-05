/* @layer core @kind logic */
import { parseOptionSchema } from '@drizztdourden08/archipelia-client-kit';
import type { OptionSchema } from '@drizztdourden08/archipelia-client-kit';
import type { ExportedOption } from '../export';

const parsed = new WeakMap<readonly ExportedOption[], OptionSchema>();

const optionSchema = (rows: readonly ExportedOption[]): OptionSchema => {
  const cached = parsed.get(rows);
  if (cached !== undefined) return cached;
  const schema = parseOptionSchema(rows);
  parsed.set(rows, schema);
  return schema;
};

export { optionSchema };
