/* @layer core @kind logic */
import type { AppErrorWire } from './app-error.type';
import { APP_ERROR_CODE, APP_ERROR_DATA_MAX, APP_ERROR_MARKER, ELECTRON_INVOKE_PREFIX } from './app-error.constants';
import { AppError } from './app-error';
import { isJsonValue } from './is-json-value';

const parseWire = (json: string): AppErrorWire | undefined => {
  try {
    const wire = JSON.parse(json) as Partial<AppErrorWire> | null;
    if (wire === null || typeof wire !== 'object' || typeof wire.code !== 'string' || !APP_ERROR_CODE.test(wire.code)) return undefined;
    if (wire.data !== undefined && (!isJsonValue(wire.data) || JSON.stringify(wire.data).length > APP_ERROR_DATA_MAX)) return undefined;
    return { code: wire.code, data: wire.data, dataDropped: wire.dataDropped === true };
  } catch {
    return undefined;
  }
};

const decodeAppError = (message: string): AppError | undefined => {
  const at = message.indexOf(APP_ERROR_MARKER);
  if (at < 0) return undefined;
  const wire = parseWire(message.slice(at + APP_ERROR_MARKER.length));
  if (wire === undefined) return undefined;
  return new AppError(message.slice(0, at).replace(ELECTRON_INVOKE_PREFIX, ''), wire);
};

export { decodeAppError };
