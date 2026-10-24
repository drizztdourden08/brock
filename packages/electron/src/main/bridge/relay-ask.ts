/* @layer electron-main @kind logic */
import type { AskChannel, InvokeSignature } from '@drizztdourden08/brock-core/ipc';
import { askWithin } from '../ipc/ask-within';
import { ASK_TIMEOUT_MS } from '../ipc/ask.constants';
import type { RelayAskOptions } from './app-bridge.type';
import { BRIDGE_CODES, BRIDGE_RELAY_MAX_PENDING } from './bridge.constants';
import { BridgeError } from './bridge-error';
import type { BridgeRoute, BridgeServer } from './bridge.type';
import { relayAskFailure } from './relay-ask-failure';

const relayAsk = <F extends InvokeSignature>(bridge: BridgeServer, channel: AskChannel<string, F>, { window, timeoutMs = ASK_TIMEOUT_MS, validate }: RelayAskOptions): (() => void) => {
  const route: BridgeRoute<F> = { kind: 'invoke', channel: channel.channel };
  const state = { pending: 0 };
  return bridge.handle(route, (async (...args: unknown[]): Promise<unknown> => {
    if (state.pending >= BRIDGE_RELAY_MAX_PENDING) throw new BridgeError('too many requests are waiting for the window', { code: BRIDGE_CODES.busy });
    const win = window();
    if (!win) throw new BridgeError('no window is open to answer', { code: BRIDGE_CODES.noWindow });
    state.pending += 1;
    try {
      return await askWithin(timeoutMs, win, channel.channel as never, ...(args as never[]));
    } catch (error) {
      throw relayAskFailure(error);
    } finally {
      state.pending -= 1;
    }
  }) as never, { validate });
};

export { relayAsk };
