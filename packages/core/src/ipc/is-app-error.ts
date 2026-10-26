/* @layer core @kind logic */
import type { AppErrorShape } from './app-error.type';
import { toAppError } from './to-app-error';

const isAppError = (value: unknown, code?: string): value is AppErrorShape => {
  const error = toAppError(value);
  return error !== undefined && (code === undefined || error.code === code);
};

export { isAppError };
