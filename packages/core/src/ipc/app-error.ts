/* @layer core @kind logic */
import type { AppErrorOptions, JsonValue } from './app-error.type';
import { APP_ERROR_CODE } from './app-error.constants';
import { isJsonValue } from './is-json-value';

class AppError extends Error {
  override readonly name = 'AppError';
  readonly code: string;
  readonly data: JsonValue | undefined;
  readonly dataDropped: boolean;

  constructor(message: string, { code, data, dataDropped = false, cause }: AppErrorOptions) {
    super(message, cause === undefined ? undefined : { cause });
    if (!APP_ERROR_CODE.test(code)) throw new TypeError(`AppError code "${code}" must match ${String(APP_ERROR_CODE)}`);
    if (data !== undefined && !isJsonValue(data)) throw new TypeError('AppError data must be JSON-safe: plain objects, arrays, strings, finite numbers, booleans and null');
    this.code = code;
    this.data = data;
    this.dataDropped = dataDropped;
  }
}

export { AppError };
