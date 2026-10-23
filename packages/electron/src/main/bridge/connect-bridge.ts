/* @layer electron-main @kind logic */
import type { BridgeClient, BridgeClientOptions, BridgeLink } from './bridge.type';
import { BRIDGE_FILE_ENV, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_PROTOCOL, BRIDGE_REQUEST_TIMEOUT_MS } from './bridge.constants';
import { bridgeDiscoveryFile } from './bridge-discovery-file';
import { encodeMessage } from './encode-message';
import { openBridgeLink } from './open-bridge-link';
import { createPendingReplies } from './pending-replies';

const discoveryFileOf = ({ file, app }: BridgeClientOptions): string => {
  const chosen = file ?? process.env[BRIDGE_FILE_ENV];
  if (chosen) return chosen;
  if (!app) throw new Error(`connectBridge needs the app id, a file, or ${BRIDGE_FILE_ENV} in the environment.`);
  return bridgeDiscoveryFile(app);
};

const connectBridge = (options: BridgeClientOptions): BridgeClient => {
  const file = discoveryFileOf(options);
  const maxBytes = options.maxMessageBytes ?? BRIDGE_MAX_MESSAGE_BYTES;
  const timeoutMs = options.timeoutMs ?? BRIDGE_REQUEST_TIMEOUT_MS;
  const pending = createPendingReplies();
  const state: { link: Promise<BridgeLink> | null; nextId: number } = { link: null, nextId: 1 };
  const link = (): Promise<BridgeLink> => {
    if (state.link) return state.link;
    const opening = openBridgeLink(file, maxBytes, {
      onReply: pending.settle,
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
    const line = encodeMessage({ v: BRIDGE_PROTOCOL, id, secret: open.secret, channel: route.channel, args }, maxBytes);
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
  return { request, close };
};

export { connectBridge };
