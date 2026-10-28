/* @layer renderer-shell @kind logic */
import type { ArgField, ArgSchema } from './command.type';

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

const rangeProblem = (name: string, field: ArgField, value: number): string | null => {
  if (field.min !== undefined && value < field.min) return `${name} must be at least ${field.min}.`;
  if (field.max !== undefined && value > field.max) return `${name} must be at most ${field.max}.`;
  return null;
};

const fieldProblem = (name: string, field: ArgField, value: unknown): string | null => {
  if (typeof value !== field.type) return `${name} must be a ${field.type}.`;
  if (field.options !== undefined && !field.options.some((option) => option.value === value)) return `${name} is not one of the allowed values.`;
  return typeof value === 'number' ? rangeProblem(name, field, value) : null;
};

const validateArgs = (schema: ArgSchema, args: unknown): string | null => {
  const given = args === undefined ? {} : args;
  if (!isRecord(given)) return 'The arguments must be an object.';
  const stray = Object.keys(given).find((name) => schema[name] === undefined);
  if (stray !== undefined) return `${stray} is not an argument of this command.`;
  for (const [name, field] of Object.entries(schema)) {
    const value = given[name];
    if (value === undefined) {
      if (field.optional !== true) return `${name} is required.`;
    } else {
      const problem = fieldProblem(name, field, value);
      if (problem !== null) return problem;
    }
  }
  return null;
};

export { validateArgs };
