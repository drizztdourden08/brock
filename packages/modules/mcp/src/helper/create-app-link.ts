/* @layer mcp-helper @kind logic */
import { connectBridge } from '@drizztdourden08/brock-electron/bridge';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import { MCP_BRIDGE_LIMITS, MCP_TIMEOUT_MS } from '../mcp.constants';
import { checkHello } from './check-hello';
import type { AppLink, LinkState } from './helper.type';
import { HELPER_ROUTE } from './helper-routes.constants';

const createAppLink = (initialFile: string): AppLink => {
  const state: LinkState = { file: initialFile, client: null, hello: null, down: false };
  const listeners = new Set<() => void>();
  const notify = (): void => {
    for (const listener of listeners) listener();
  };
  const drop = (): void => {
    state.client?.close();
    state.client = null;
    state.hello = null;
  };
  const clientOf = (): BridgeClient => {
    if (state.client !== null) return state.client;
    const client = connectBridge({ file: state.file, timeoutMs: MCP_TIMEOUT_MS.call, maxMessageBytes: MCP_BRIDGE_LIMITS.maxMessageBytes });
    client.on(HELPER_ROUTE.toolsChanged, notify);
    state.client = client;
    return client;
  };
  const ready = async (): Promise<BridgeClient> => {
    const client = clientOf();
    state.hello ??= checkHello(client);
    await state.hello;
    return client;
  };
  const run = async <T>(use: (client: BridgeClient) => Promise<T>): Promise<T> => {
    try {
      const value = await use(await ready());
      if (state.down) {
        state.down = false;
        notify();
      }
      return value;
    } catch (error) {
      state.down = true;
      state.hello = null;
      throw error;
    }
  };
  return {
    file: () => state.file,
    retarget: (file) => {
      drop();
      state.file = file;
      state.down = false;
      notify();
    },
    tools: () => run((client) => client.request(HELPER_ROUTE.tools)),
    call: (name, args) => run((client) => client.request(HELPER_ROUTE.call, name, args)),
    onToolsChanged: (listener) => void listeners.add(listener),
    warm: () => void run(() => Promise.resolve()).catch(() => undefined),
    close: drop,
  };
};

export { createAppLink };
