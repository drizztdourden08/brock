/* @layer core @kind logic */
import type { AppErrorShape, AppErrorWire } from './app-error.type';
import { APP_ERROR_DATA_MAX, APP_ERROR_MARKER, APP_ERROR_MESSAGE_MAX } from './app-error.constants';

const encodeAppError = (error: AppErrorShape): string => {
  const message = error.message.split(APP_ERROR_MARKER).join('').slice(0, APP_ERROR_MESSAGE_MAX);
  const json = error.data === undefined ? '' : JSON.stringify(error.data);
  const dropped = error.dataDropped || json.length > APP_ERROR_DATA_MAX;
  const wire: AppErrorWire = { code: error.code, data: dropped ? undefined : error.data, dataDropped: dropped || undefined };
  return `${message}${APP_ERROR_MARKER}${JSON.stringify(wire)}`;
};

export { encodeAppError };
