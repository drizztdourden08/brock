/* @layer electron-main @kind logic */
import { BRIDGE_ASK_TIMED_OUT, BRIDGE_ASK_WINDOW_GONE, BRIDGE_CODES } from './bridge.constants';
import { BridgeError } from './bridge-error';

const relayAskFailure = (error: unknown): unknown => {
  const message = error instanceof Error ? error.message : '';
  if (BRIDGE_ASK_TIMED_OUT.test(message)) return new BridgeError('the window did not answer in time', { code: BRIDGE_CODES.timeout });
  if (BRIDGE_ASK_WINDOW_GONE.test(message)) return new BridgeError('the window closed before it answered', { code: BRIDGE_CODES.closed });
  return error;
};

export { relayAskFailure };
