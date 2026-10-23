/* @layer electron-main @kind test */
import { mkdtempSync, rmSync } from 'fs';
import { connect, type Socket } from 'net';
import { tmpdir } from 'os';
import { join } from 'path';
import { invoke } from '@drizztdourden08/brock-core/ipc';
import { BRIDGE_PROTOCOL, connectBridge, startBridgeServer, writeBridgeDiscovery } from '../src/bridge';
import type { BridgeClient, BridgeServer, BridgeServerOptions } from '../src/bridge';
import { bridgeProof } from '../src/main/bridge/bridge-proof';
import { createLineReader } from '../src/main/bridge/line-reader';

const ROUTES = {
  add: invoke<(a: number, b: number) => Promise<number>>()('test:add'),
  echo: invoke<(text: string) => Promise<string>>()('test:echo'),
  slow: invoke<() => Promise<string>>()('test:slow'),
  missing: invoke<() => Promise<void>>()('test:missing'),
};

const opened: { servers: BridgeServer[]; clients: BridgeClient[]; sockets: Socket[]; dirs: string[] } = { servers: [], clients: [], sockets: [], dirs: [] };

const closeOpened = (): void => {
  for (const made of opened.clients.splice(0)) made.close();
  for (const socket of opened.sockets.splice(0)) socket.destroy();
  for (const server of opened.servers.splice(0)) server.close();
  for (const dir of opened.dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
};

const tempDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-bridge-test-'));
  opened.dirs.push(dir);
  return dir;
};

const discoveryOf = (server: Pick<BridgeServer, 'endpoint' | 'secret'>, pid = process.pid) => ({
  v: BRIDGE_PROTOCOL, app: 'bridge-test', pid, endpoint: server.endpoint, secret: server.secret, startedAt: new Date().toISOString(),
});

const discoveryFor = (server: Pick<BridgeServer, 'endpoint' | 'secret'>, pid = process.pid): string => {
  const file = join(tempDir(), 'bridge.json');
  writeBridgeDiscovery(file, discoveryOf(server, pid));
  return file;
};

const serve = async (options: Partial<BridgeServerOptions> = {}): Promise<{ server: BridgeServer; file: string }> => {
  const server = await startBridgeServer({ app: 'bridge-test', handshakeMs: 2000, ...options });
  opened.servers.push(server);
  server.handle(ROUTES.add, (a, b) => a + b);
  server.handle(ROUTES.echo, (text) => text);
  server.handle(ROUTES.slow, () => new Promise(() => undefined));
  return { server, file: discoveryFor(server) };
};

const client = (file: string, timeoutMs?: number): BridgeClient => {
  const made = connectBridge({ file, timeoutMs });
  opened.clients.push(made);
  return made;
};

const rawSession = (endpoint: string) => {
  const socket = connect({ path: endpoint });
  opened.sockets.push(socket);
  const queue: unknown[] = [];
  const waiters: ((value: unknown) => void)[] = [];
  const onLine = (line: string): void => {
    const value: unknown = JSON.parse(line);
    const waiter = waiters.shift();
    if (waiter) waiter(value);
    else queue.push(value);
  };
  socket.on('data', createLineReader(1_048_576, onLine, () => undefined));
  socket.on('error', () => undefined);
  return {
    send: (value: unknown): void => {
      socket.write(`${JSON.stringify(value)}\n`);
    },
    next: (): Promise<unknown> => new Promise((resolve) => {
      if (queue.length > 0) resolve(queue.shift());
      else waiters.push(resolve);
    }),
    closed: new Promise<void>((resolve) => socket.once('close', () => resolve())),
  };
};

const handshake = async (session: ReturnType<typeof rawSession>, secret: string): Promise<string> => {
  const nonce = bridgeProof.nonce();
  session.send({ v: BRIDGE_PROTOCOL, hello: nonce });
  const reply = (await session.next()) as { hello: string };
  return bridgeProof.sessionKey(secret, nonce, reply.hello);
};

const signed = (key: string, id: number, channel: string, args: unknown[]) => {
  const body = JSON.stringify(args);
  return { id, channel, args: body, mac: bridgeProof.request(key, id, channel, body) };
};

export { ROUTES, client, closeOpened, discoveryFor, discoveryOf, handshake, rawSession, serve, signed, tempDir };
