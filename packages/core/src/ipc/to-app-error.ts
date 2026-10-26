/* @layer core @kind logic */
import type { AppErrorShape } from './app-error.type';
import { AppError } from './app-error';
import { decodeAppError } from './decode-app-error';

const isAdopted = (value: Error): value is AppErrorShape => {
  const { code, dataDropped } = value as Partial<AppErrorShape>;
  return typeof code === 'string' && typeof dataDropped === 'boolean';
};

const toAppError = (value: unknown): AppErrorShape | undefined => {
  if (value instanceof AppError) return value;
  if (!(value instanceof Error)) return undefined;
  if (isAdopted(value)) return value;
  const decoded = decodeAppError(value.message);
  if (decoded === undefined) return undefined;
  return Object.assign(value, { message: decoded.message, code: decoded.code, data: decoded.data, dataDropped: decoded.dataDropped });
};

export { toAppError };
