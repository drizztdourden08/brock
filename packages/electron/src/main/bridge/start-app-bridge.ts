/* @layer electron-main @kind logic */
import { app } from 'electron';
import { join } from 'path';
import type { MainContext } from '../types/main-context.type';
import type { AppBridgeOptions } from './app-bridge.type';
import { BRIDGE_DISCOVERY_FILE, BRIDGE_PROTOCOL } from './bridge.constants';
import { removeDiscovery } from './remove-discovery';
import { startBridgeServer } from './start-bridge-server';
import { writeDiscovery } from './write-discovery';

const discoveryFileFor = (id: string, ownUserData: boolean): string =>
  (ownUserData ? join(app.getPath('userData'), BRIDGE_DISCOVERY_FILE) : join(app.getPath('appData'), id, BRIDGE_DISCOVERY_FILE));

const startAppBridge = async (ctx: MainContext, options: AppBridgeOptions, ownUserData: boolean): Promise<void> => {
  const id = ctx.product.id;
  const server = await startBridgeServer({ app: id, maxMessageBytes: options.maxMessageBytes, maxClients: options.maxClients });
  const file = discoveryFileFor(id, ownUserData);
  const stop = (): void => {
    server.close();
    removeDiscovery(file, server.secret);
  };
  try {
    await options.register(server, ctx);
    writeDiscovery(file, { v: BRIDGE_PROTOCOL, app: id, pid: process.pid, endpoint: server.endpoint, secret: server.secret, startedAt: new Date().toISOString() });
  } catch (error) {
    stop();
    throw error;
  }
  app.once('will-quit', stop);
  process.once('exit', stop);
  ctx.log(`bridge open; its discovery file is ${file}`);
};

export { startAppBridge };
