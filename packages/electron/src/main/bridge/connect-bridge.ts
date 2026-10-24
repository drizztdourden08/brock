/* @layer electron-main @kind logic */
import type { BridgeClient, BridgeClientOptions, BridgeLink } from './bridge-client.type';
import { BRIDGE_HANDSHAKE_MS, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_REQUEST_TIMEOUT_MS } from './bridge.constants';
import { discoveryFileOf } from './discovery-file-of';
import { encodeMessage } from './encode-message';
import { openBridgeLink } from './open-bridge-link';
import { createPendingReplies } from './pending-replies';
import { pushListeners } from './push-listeners';
import { toJson } from './to-json';

const connectBridge = (options: BridgeClientOptions): BridgeClient => {
  const file = discoveryFileOf(options);
  const maxBytes = options.maxMessageBytes ?? BRIDGE_MAX_MESSAGE_BYTES;
  const timeoutMs = options.timeoutMs ?? BRIDGE_REQUEST_TIMEOUT_MS;
  const pending = createPendingReplies();
  const listeners = pushListeners();
  const state: { link: Promise<BridgeLink> | null; nextId: number } = { link: null, nextId: 1 };
  const link = (): Promise<BridgeLink> => {
    if (state.link) return state.link;
    const opening = openBridgeLink(file, { maxBytes, handshakeMs: options.handshakeMs ?? BRIDGE_HANDSHAKE_MS }, {
      onReply: pending.settle,
      onPush: listeners.dispatch,
      onClose: (error) => {
        if (state.link === opening) state.link = null;
        pending.failAll(error);
      },
    });
    state.link = opening;
    opening.catch(() => {
      if (state.link === opening) state.link = null;
    });
    return opening;
  };
  const request: BridgeClient['request'] = async (route, ...args) => {
    const open = await link();
    const id = state.nextId;
    state.nextId += 1;
    const body = toJson(args);
    const line = body === null ? null : encodeMessage({ id, channel: route.channel, args: body, mac: open.sign(id, route.channel, body) }, maxBytes);
    if (line === null) throw new Error(`bridge request "${route.channel}" is not JSON or is larger than ${maxBytes} bytes`);
    const reply = pending.wait(id, route.channel, timeoutMs);
    open.write(line);
    return reply as never;
  };
  const close = (): void => {
    const current = state.link;
    state.link = null;
    void current?.then((open) => open.end(), () => undefined);
  };
  return { request, on: listeners.on, connect: () => link().then((open) => open.connectionId), close };
};

export { connectBridge };
