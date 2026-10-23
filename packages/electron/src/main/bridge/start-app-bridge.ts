/* @layer electron-main @kind logic */
import { app } from 'electron';
import { join } from 'path';
import type { MainContext } from '../types/main-context.type';
import type { AppBridgeOptions } from './app-bridge.type';
import { BRIDGE_PROTOCOL } from './bridge.constants';
import { bridgeFileName } from './bridge-file-name';
import { clearStaleDiscovery } from './clear-stale-discovery';
import { removeDiscovery } from './remove-discovery';
import { startBridgeServer } from './start-bridge-server';
import { writeBridgeDiscovery } from './write-bridge-discovery';

const startAppBridge = async (ctx: MainContext, options: AppBridgeOptions, key: string | null): Promise<void> => {
  const id = ctx.product.id;
  const file = join(app.getPath('appData'), id, bridgeFileName(key));
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
  app.once('will-quit', stop);
  process.once('exit', stop);
  ctx.log(`bridge open; its discovery file is ${file}`);
};

export { startAppBridge };
