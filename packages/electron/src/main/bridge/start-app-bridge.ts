/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { AppBridgeOptions, OpenedAppBridge } from './app-bridge.type';
import { BRIDGE_PROTOCOL } from './bridge.constants';
import { clearStaleDiscovery } from './clear-stale-discovery';
import { removeDiscovery } from './remove-discovery';
import { startBridgeServer } from './start-bridge-server';
import { writeBridgeDiscovery } from './write-bridge-discovery';

const startAppBridge = async (ctx: MainContext, options: AppBridgeOptions, file: string): Promise<OpenedAppBridge> => {
  const id = ctx.product.id;
  if (clearStaleDiscovery(file)) ctx.log(`bridge: removed a stale discovery file, ${file}`);
  const server = await startBridgeServer({
    app: id,
    maxMessageBytes: options.maxMessageBytes,
    maxClients: options.maxClients,
    onError: (channel, error) => ctx.log(`bridge request "${channel}" failed: ${error instanceof Error ? error.message : String(error)}`, 'warn'),
  });
  const stop = (): void => {
    server.close();
    removeDiscovery(file, server.secret);
  };
  try {
    await options.register(server, ctx);
    writeBridgeDiscovery(file, { v: BRIDGE_PROTOCOL, app: id, pid: process.pid, endpoint: server.endpoint, secret: server.secret, startedAt: new Date().toISOString() });
  } catch (error) {
    stop();
    throw error;
  }
  ctx.log(`bridge open; its discovery file is ${file}`);
  return { server, stop };
};

export { startAppBridge };
