/* @layer core @kind logic */
import type { JsonValue } from './app-error.type';
import { APP_ERROR_DEPTH_MAX } from './app-error.constants';

const isPlainObject = (value: object): boolean => {
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const isJsonValue = (value: unknown, depth = 0): value is JsonValue => {
  if (depth > APP_ERROR_DEPTH_MAX) return false;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.every((item) => isJsonValue(item, depth + 1));
  return isPlainObject(value) && Object.values(value).every((item) => isJsonValue(item, depth + 1));
};

export { isJsonValue };
