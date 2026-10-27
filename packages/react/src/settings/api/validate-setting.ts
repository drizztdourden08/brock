/* @layer renderer-shell @kind logic */
import { isRecord } from '../../collections/is-record';
import type { SettingChoice, SettingControl } from '../settings.type';

const isText = (value: unknown): value is string => typeof value === 'string';

const isList = (value: unknown): value is string[] => Array.isArray(value) && value.every(isText);

const unusable = (options: readonly SettingChoice[], value: string): string | null => {
  const found = options.find((option) => option.value === value);
  if (found === undefined) return `"${value}" is not one of: ${options.map((option) => option.value).join(', ')}.`;
  return found.disabled === undefined || found.disabled === false ? null : `"${value}" is not available right now.`;
};

const oneOf = (options: readonly SettingChoice[], value: unknown): string | null => (isText(value) ? unusable(options, value) : 'The value must be a string.');

const manyOf = (options: readonly SettingChoice[], value: unknown): string | null => {
  if (!isList(value)) return 'The value must be a list of strings.';
  return value.map((entry) => unusable(options, entry)).find((problem) => problem !== null) ?? null;
};

const within = (value: unknown, limits: { min?: number; max?: number }): string | null => {
  if (typeof value !== 'number') return 'The value must be a number.';
  if (!Number.isFinite(value)) return 'The value must be a finite number.';
  if (limits.min !== undefined && value < limits.min) return `The value must be at least ${limits.min}.`;
  if (limits.max !== undefined && value > limits.max) return `The value must be at most ${limits.max}.`;
  return null;
};

const shaped = (shape: 'object' | 'array' | 'any', value: unknown): string | null => {
  if (shape === 'object') return isRecord(value) ? null : 'The value must be an object.';
  if (shape === 'array') return Array.isArray(value) ? null : 'The value must be an array.';
  return value === undefined ? 'The value must not be undefined.' : null;
};

const checkControl = (control: SettingControl, value: unknown): string | null => {
  if (control.kind === 'multi') return manyOf(control.options, value);
  if ('options' in control) return oneOf(control.options, value);
  if (control.kind === 'range' || control.kind === 'number') return within(value, control);
  if (control.kind === 'tags') return isList(value) ? null : 'The value must be a list of strings.';
  if (control.kind === 'json') return shaped(control.shape ?? 'any', value);
  return isText(value) ? null : 'The value must be a string.';
};

const validateSetting = (control: SettingControl | undefined, current: unknown, value: unknown): string | null => {
  if (control !== undefined) return checkControl(control, value);
  if (typeof current !== 'boolean') return 'This setting has no editable control.';
  return typeof value === 'boolean' ? null : 'The value must be true or false.';
};

export { validateSetting };
