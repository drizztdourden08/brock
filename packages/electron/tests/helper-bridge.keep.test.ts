/* @layer electron-main @kind test */
import { spawnSync } from 'child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'fs';
import { connect } from 'net';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { invoke } from '@drizztdourden08/brock-core/ipc';
import { BRIDGE_PROTOCOL, bridgeDiscoveryFile, connectBridge, startBridgeServer } from '../src/bridge';
import type { BridgeClient, BridgeServer } from '../src/bridge';
import { createLineReader } from '../src/main/bridge/line-reader';
import { isLocalEndpoint } from '../src/main/bridge/is-local-endpoint';
import { removeDiscovery } from '../src/main/bridge/remove-discovery';
import { writeDiscovery } from '../src/main/bridge/write-discovery';

const ROUTES = {
  add: invoke<(a: number, b: number) => Promise<number>>()('test:add'),
  echo: invoke<(text: string) => Promise<string>>()('test:echo'),
  slow: invoke<() => Promise<string>>()('test:slow'),
  missing: invoke<() => Promise<void>>()('test:missing'),
};

const opened: { servers: BridgeServer[]; clients: BridgeClient[]; dirs: string[] } = { servers: [], clients: [], dirs: [] };

afterEach(() => {
  for (const client of opened.clients.splice(0)) client.close();
  for (const server of opened.servers.splice(0)) server.close();
  for (const dir of opened.dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const tempDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-bridge-test-'));
  opened.dirs.push(dir);
  return dir;
};

const discoveryOf = (server: BridgeServer, pid = process.pid) => ({
  v: BRIDGE_PROTOCOL, app: 'bridge-test', pid, endpoint: server.endpoint, secret: server.secret, startedAt: new Date().toISOString(),
});

const serve = async (maxMessageBytes?: number): Promise<{ server: BridgeServer; file: string }> => {
  const server = await startBridgeServer({ app: 'bridge-test', maxMessageBytes, firstMessageMs: 2000 });
  opened.servers.push(server);
  server.handle(ROUTES.add, (a, b) => a + b);
  server.handle(ROUTES.echo, (text) => text);
  server.handle(ROUTES.slow, () => new Promise(() => undefined));
  const file = join(tempDir(), 'bridge.json');
  writeDiscovery(file, discoveryOf(server));
  return { server, file };
};

const client = (file: string, timeoutMs?: number): BridgeClient => {
  const made = connectBridge({ file, timeoutMs });
  opened.clients.push(made);
  return made;
};

const exchange = (endpoint: string, payload: string): Promise<unknown[]> => new Promise((resolve) => {
  const socket = connect({ path: endpoint });
  const text: string[] = [];
  socket.on('data', (chunk) => text.push(chunk.toString('utf8')));
  socket.on('error', () => undefined);
  socket.once('close', () => resolve(text.join('').split('\n').filter(Boolean).map((line): unknown => JSON.parse(line))));
  socket.write(payload);
});

describe('the helper bridge', () => {
  it('opens a local pipe or a private socket, never a TCP port', async () => {
    const { server } = await serve();
    if (process.platform === 'win32') expect(server.endpoint.startsWith('\\\\.\\pipe\\brock-bridge-test-')).toBe(true);
    else expect(statSync(server.endpoint).mode & 0o777).toBe(0o600);
    expect(isLocalEndpoint(server.endpoint)).toBe(true);
    expect(isLocalEndpoint('\\\\otherhost\\pipe\\brock-x', 'win32')).toBe(false);
    expect(isLocalEndpoint('127.0.0.1:4000', 'linux')).toBe(false);
  });

  it('answers typed requests from several clients at once', async () => {
    const { file } = await serve();
    const first = client(file);
    const second = client(file);
    const answers = await Promise.all([first.request(ROUTES.add, 2, 3), second.request(ROUTES.echo, 'hello'), first.request(ROUTES.add, 10, -4)]);
    expect(answers).toEqual([5, 'hello', 6]);
    await expect(first.request(ROUTES.missing)).rejects.toThrow('no handler is registered for "test:missing"');
  });

  it('refuses a request with a wrong secret and closes the connection', async () => {
    const { server } = await serve();
    const spy = vi.fn(() => 'reached');
    server.handle(invoke<() => Promise<string>>()('test:spy'), spy);
    const lines = await exchange(server.endpoint, `${JSON.stringify({ v: BRIDGE_PROTOCOL, id: 1, secret: 'guess', channel: 'test:spy', args: [] })}\n`);
    expect(lines).toEqual([{ id: 1, ok: false, error: 'unauthorized' }]);
    expect(spy).not.toHaveBeenCalled();
    const garbage = await exchange(server.endpoint, 'not json\n');
    expect(garbage).toEqual([{ id: null, ok: false, error: 'the message is not a bridge request' }]);
  });
});

describe('the helper bridge limits', () => {
  it('bounds the message size on both sides', async () => {
    const { server, file } = await serve(256);
    const lines = await exchange(server.endpoint, 'x'.repeat(1024));
    expect(lines).toEqual([{ id: null, ok: false, error: 'the message is larger than the bridge allows' }]);
    const small = client(file);
    await expect(small.request(ROUTES.echo, 'y'.repeat(512))).rejects.toThrow('the message is larger than the bridge allows');
    const tight = connectBridge({ file, maxMessageBytes: 128 });
    opened.clients.push(tight);
    await expect(tight.request(ROUTES.echo, 'z'.repeat(200))).rejects.toThrow('larger than 128 bytes');
    await expect(small.request(ROUTES.echo, 'w'.repeat(100))).resolves.toBe('w'.repeat(100));
  });

  it('rejects pending requests when the app closes the bridge, and times out a silent handler', async () => {
    const { server, file } = await serve();
    await expect(client(file, 200).request(ROUTES.slow)).rejects.toThrow('timed out after 200 ms');
    const waiting = client(file).request(ROUTES.slow);
    await new Promise((resolve) => setTimeout(resolve, 100));
    server.close();
    await expect(waiting).rejects.toThrow();
  });

});

describe('the bridge discovery file', () => {
  it('writes a private discovery file and removes only its own session', async () => {
    const { server, file } = await serve();
    if (process.platform !== 'win32') expect(statSync(file).mode & 0o777).toBe(0o600);
    expect(removeDiscovery(file, 'another session')).toBe(false);
    expect(existsSync(file)).toBe(true);
    expect(removeDiscovery(file, server.secret)).toBe(true);
    expect(existsSync(file)).toBe(false);
    await expect(client(file).request(ROUTES.add, 1, 1)).rejects.toThrow('is missing');
  });

  it('refuses a discovery file left by a session that ended', async () => {
    const { server } = await serve();
    const stale = join(tempDir(), 'bridge.json');
    writeDiscovery(stale, discoveryOf(server, spawnSync(process.execPath, ['-e', '']).pid));
    await expect(client(stale).request(ROUTES.add, 1, 1)).rejects.toThrow('left from a session that ended');
  });

  it('finds the discovery file in the per-user app data folder', () => {
    expect(bridgeDiscoveryFile('bxel', { env: { APPDATA: 'C:\\Users\\u\\AppData\\Roaming' }, platform: 'win32', home: 'C:\\Users\\u' }))
      .toBe(join('C:\\Users\\u\\AppData\\Roaming', 'bxel', 'bridge.json'));
    expect(bridgeDiscoveryFile('bxel', { env: {}, platform: 'linux', home: '/home/u' })).toBe(join('/home/u', '.config', 'bxel', 'bridge.json'));
    expect(bridgeDiscoveryFile('bxel', { env: {}, platform: 'darwin', home: '/Users/u' })).toBe(join('/Users/u', 'Library', 'Application Support', 'bxel', 'bridge.json'));
  });

  it('reads lines split across chunks and stops at the limit', () => {
    const lines: string[] = [];
    const overflow = vi.fn();
    const read = createLineReader(8, (line) => lines.push(line), overflow);
    read(Buffer.from('ab'));
    read(Buffer.from('c\nde\n\nf'));
    read(Buffer.from('g\n'));
    expect(lines).toEqual(['abc', 'de', 'fg']);
    read(Buffer.from('123456789'));
    expect(overflow).toHaveBeenCalledTimes(1);
    read(Buffer.from('\nlater\n'));
    expect(lines).toEqual(['abc', 'de', 'fg']);
  });
});
