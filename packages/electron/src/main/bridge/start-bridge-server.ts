/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { rmSync } from 'fs';
import { createServer, type Socket } from 'net';
import type { BridgeRouteEntry, BridgeRouteOptions, BridgeServer, BridgeServerOptions, BridgeSession } from './bridge.type';
import { BRIDGE_HANDSHAKE_MS, BRIDGE_MAX_CLIENTS, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_MAX_PENDING, BRIDGE_SECRET_BYTES } from './bridge.constants';
import { connectionRegistry } from './connection-registry';
import { listenPrivate } from './listen-private';
import { serveConnection } from './serve-connection';

const routeTable = () => {
  const routes = new Map<string, BridgeRouteEntry>();
  const add = (channel: string, call: BridgeRouteEntry['call'], { validate }: BridgeRouteOptions = {}): (() => void) => {
    if (routes.has(channel)) throw new Error(`the bridge already handles "${channel}"`);
    routes.set(channel, { call, validate: validate ?? null });
    return () => {
      routes.delete(channel);
    };
  };
  const handle: BridgeServer['handle'] = (route, handler, options) => add(route.channel, (args): unknown => Reflect.apply(handler, undefined, args), options);
  const handleWith: BridgeServer['handleWith'] = (route, handler, options) =>
    add(route.channel, (args, call): unknown => Reflect.apply(handler, undefined, [call, ...args]), options);
  return { routes, handle, handleWith };
};

const startBridgeServer = async (options: BridgeServerOptions): Promise<BridgeServer> => {
  const table = routeTable();
  const registry = connectionRegistry(options.maxClients ?? BRIDGE_MAX_CLIENTS);
  const sockets = new Set<Socket>();
  const pending = new Set<Socket>();
  const session: BridgeSession = {
    secret: randomBytes(BRIDGE_SECRET_BYTES).toString('base64url'),
    routes: table.routes,
    maxMessageBytes: options.maxMessageBytes ?? BRIDGE_MAX_MESSAGE_BYTES,
    handshakeMs: options.handshakeMs ?? BRIDGE_HANDSHAKE_MS,
    onError: options.onError ?? (() => undefined),
    admit: registry.admit,
    release: registry.release,
  };
  const server = createServer((socket) => {
    if (pending.size >= (options.maxPending ?? BRIDGE_MAX_PENDING)) {
      socket.destroy();
      return;
    }
    pending.add(socket);
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
    serveConnection(socket, { ...session, admit: (link) => (pending.delete(socket) ? registry.admit(link) : null) });
    socket.once('close', () => pending.delete(socket));
  });
  const endpoint = await listenPrivate(server, options.app);
  return {
    endpoint: endpoint.path,
    secret: session.secret,
    handle: table.handle,
    handleWith: table.handleWith,
    onOpen: registry.onOpen,
    onClose: registry.onClose,
    connections: registry.connections,
    emit: registry.emit,
    emitTo: registry.emitTo,
    close: () => {
      if (endpoint.dir) rmSync(endpoint.dir, { recursive: true, force: true });
      for (const socket of sockets) socket.destroy();
      server.close();
    },
  };
};

export { startBridgeServer };
