/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { rmSync } from 'fs';
import { createServer, type Socket } from 'net';
import type { BridgeRouteFn, BridgeServer, BridgeServerOptions } from './bridge.type';
import { BRIDGE_FIRST_MESSAGE_MS, BRIDGE_MAX_CLIENTS, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_SECRET_BYTES } from './bridge.constants';
import { listenPrivate } from './listen-private';
import { serveConnection } from './serve-connection';

const startBridgeServer = async (options: BridgeServerOptions): Promise<BridgeServer> => {
  const secret = randomBytes(BRIDGE_SECRET_BYTES).toString('base64url');
  const routes = new Map<string, BridgeRouteFn>();
  const sockets = new Set<Socket>();
  const maxClients = options.maxClients ?? BRIDGE_MAX_CLIENTS;
  const session = {
    secret,
    routes,
    maxMessageBytes: options.maxMessageBytes ?? BRIDGE_MAX_MESSAGE_BYTES,
    firstMessageMs: options.firstMessageMs ?? BRIDGE_FIRST_MESSAGE_MS,
  };
  const server = createServer((socket) => {
    if (sockets.size >= maxClients) {
      socket.destroy();
      return;
    }
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
    serveConnection(socket, session);
  });
  const endpoint = await listenPrivate(server, options.app);
  return {
    endpoint: endpoint.path,
    secret,
    handle: (route, handler) => {
      if (routes.has(route.channel)) throw new Error(`the bridge already handles "${route.channel}"`);
      routes.set(route.channel, (args) => Reflect.apply(handler, undefined, args));
      return () => {
        routes.delete(route.channel);
      };
    },
    close: () => {
      if (endpoint.dir) rmSync(endpoint.dir, { recursive: true, force: true });
      for (const socket of sockets) socket.destroy();
      server.close();
    },
  };
};

export { startBridgeServer };
