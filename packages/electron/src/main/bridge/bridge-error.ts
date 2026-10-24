/* @layer electron-main @kind logic */
import type { BridgeErrorOptions } from './bridge.type';
import { BRIDGE_CODES, BRIDGE_ERROR_CODE } from './bridge.constants';

class BridgeError extends Error {
  override readonly name = 'BridgeError';
  readonly code: string;
  readonly data: unknown;

  constructor(message: string, { code, data }: BridgeErrorOptions = {}) {
    super(message);
    this.code = code !== undefined && BRIDGE_ERROR_CODE.test(code) ? code : BRIDGE_CODES.error;
    this.data = data;
  }
}

export { BridgeError };
