/* @layer electron-main @kind logic */
import type { AskChannel, InvokeSignature } from '@drizztdourden08/brock-core/ipc';
import { askWithin } from '../ipc/ask-within';
import { ASK_TIMEOUT_MS } from '../ipc/ask.constants';
import type { RelayAskOptions } from './app-bridge.type';
import { BRIDGE_CODES } from './bridge.constants';
import { BridgeError } from './bridge-error';
import type { BridgeRoute, BridgeServer } from './bridge.type';

const relayAsk = <F extends InvokeSignature>(bridge: BridgeServer, channel: AskChannel<string, F>, { window, timeoutMs = ASK_TIMEOUT_MS, validate }: RelayAskOptions): (() => void) => {
  const route: BridgeRoute<F> = { kind: 'invoke', channel: channel.channel };
  return bridge.handle(route, (async (...args: unknown[]): Promise<unknown> => {
    const win = window();
    if (!win) throw new BridgeError('no window is open to answer', { code: BRIDGE_CODES.noWindow });
    return askWithin(timeoutMs, win, channel.channel as never, ...(args as never[]));
  }) as never, { validate });
};

export { relayAsk };
