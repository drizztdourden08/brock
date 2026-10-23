/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { rmSync } from 'fs';
import { createServer, type Socket } from 'net';
import type { BridgeRouteEntry, BridgeServer, BridgeServerOptions, BridgeSession } from './bridge.type';
import { BRIDGE_HANDSHAKE_MS, BRIDGE_MAX_CLIENTS, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_MAX_PENDING, BRIDGE_SECRET_BYTES } from './bridge.constants';
import { listenPrivate } from './listen-private';
import { serveConnection } from './serve-connection';

const startBridgeServer = async (options: BridgeServerOptions): Promise<BridgeServer> => {
  const routes = new Map<string, BridgeRouteEntry>();
  const pending = new Set<Socket>();
  const clients = new Set<Socket>();
  const session: BridgeSession = {
    secret: randomBytes(BRIDGE_SECRET_BYTES).toString('base64url'),
    routes,
    maxMessageBytes: options.maxMessageBytes ?? BRIDGE_MAX_MESSAGE_BYTES,
    handshakeMs: options.handshakeMs ?? BRIDGE_HANDSHAKE_MS,
    onError: options.onError ?? (() => undefined),
    admit: (socket) => {
      pending.delete(socket);
      if (clients.size >= (options.maxClients ?? BRIDGE_MAX_CLIENTS)) return false;
      clients.add(socket);
      return true;
    },
  };
  const server = createServer((socket) => {
    if (pending.size >= (options.maxPending ?? BRIDGE_MAX_PENDING)) {
      socket.destroy();
      return;
    }
    pending.add(socket);
    socket.once('close', () => {
      pending.delete(socket);
      clients.delete(socket);
    });
    serveConnection(socket, session);
  });
  const endpoint = await listenPrivate(server, options.app);
  return {
    endpoint: endpoint.path,
    secret: session.secret,
    handle: (route, handler, { validate } = {}) => {
      if (routes.has(route.channel)) throw new Error(`the bridge already handles "${route.channel}"`);
      routes.set(route.channel, { call: (args): unknown => Reflect.apply(handler, undefined, args), validate: validate ?? null });
      return () => {
        routes.delete(route.channel);
      };
    },
    close: () => {
      if (endpoint.dir) rmSync(endpoint.dir, { recursive: true, force: true });
      for (const socket of [...pending, ...clients]) socket.destroy();
      server.close();
    },
  };
};

export { startBridgeServer };
