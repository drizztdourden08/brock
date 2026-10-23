/* @layer electron-main @kind test */
import { randomBytes } from 'crypto';
import { createServer } from 'net';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { invoke } from '@drizztdourden08/brock-core/ipc';
import { BRIDGE_PROTOCOL, BridgeError } from '../src/bridge';
import { bridgeProof } from '../src/main/bridge/bridge-proof';
import { createLineReader } from '../src/main/bridge/line-reader';
import { ROUTES, client, closeOpened, discoveryFor, handshake, rawSession, serve, signed, tempDir } from './bridge-fixture';

afterEach(closeOpened);

const impostorEndpoint = (): string =>
  (process.platform === 'win32' ? `\\\\.\\pipe\\brock-impostor-${randomBytes(16).toString('hex')}` : join(tempDir(), 'bridge.sock'));

const impostorServer = (heard: string[]) => createServer((socket) => {
  socket.on('data', createLineReader(4096, (line) => heard.push(line), () => undefined));
  socket.write(`${JSON.stringify({ v: BRIDGE_PROTOCOL, hello: bridgeProof.nonce(), proof: 'forged' })}\n`);
});

describe('the bridge handshake', () => {
  it('answers typed requests from several clients at once', async () => {
    const { file } = await serve();
    const first = client(file);
    const second = client(file);
    const answers = await Promise.all([first.request(ROUTES.add, 2, 3), second.request(ROUTES.echo, 'hello'), first.request(ROUTES.add, 10, -4)]);
    expect(answers).toEqual([5, 'hello', 6]);
    await expect(first.request(ROUTES.missing)).rejects.toThrow('no handler is registered for "test:missing"');
  });

  it('refuses a server that cannot prove the secret, and sends it nothing but a nonce', async () => {
    const heard: string[] = [];
    const impostor = impostorServer(heard);
    const endpoint = impostorEndpoint();
    await new Promise<void>((resolve) => impostor.listen(endpoint, resolve));
    const file = discoveryFor({ endpoint, secret: 'the real secret' });
    await expect(client(file).request(ROUTES.add, 1, 1)).rejects.toThrow('could not prove it is the app');
    impostor.close();
    expect(heard).toHaveLength(1);
    expect(heard[0]).toMatch(/^\{"v":1,"hello":"[\w-]{43}"\}$/);
  });

  it('refuses a client with the wrong secret, both ways', async () => {
    const { server } = await serve();
    const file = discoveryFor({ endpoint: server.endpoint, secret: 'wrong' });
    await expect(client(file).request(ROUTES.add, 1, 1)).rejects.toThrow('could not prove it is the app');
    const session = rawSession(server.endpoint);
    const key = await handshake(session, 'wrong');
    session.send(signed(key, 1, ROUTES.add.channel, [1, 1]));
    expect(await session.next()).toEqual({ id: 1, ok: false, error: 'unauthorized' });
    await session.closed;
  });

  it('refuses a replayed request, in the same connection and in another', async () => {
    const { server } = await serve();
    const first = rawSession(server.endpoint);
    const key = await handshake(first, server.secret);
    const request = signed(key, 1, ROUTES.add.channel, [2, 2]);
    first.send(request);
    expect(await first.next()).toEqual({ id: 1, ok: true, value: 4 });
    first.send(request);
    expect(await first.next()).toEqual({ id: 1, ok: false, error: 'unauthorized' });
    const second = rawSession(server.endpoint);
    await handshake(second, server.secret);
    second.send(request);
    expect(await second.next()).toEqual({ id: 1, ok: false, error: 'unauthorized' });
  });

  it('closes a connection that skips the hello or sends garbage', async () => {
    const { server } = await serve();
    const garbage = rawSession(server.endpoint);
    garbage.send('not a hello');
    expect(await garbage.next()).toEqual({ id: null, ok: false, error: 'the connection must start with a hello' });
    await garbage.closed;
  });
});

describe('the bridge limits', () => {
  it('caps the connections still in the handshake and drops them after the deadline', async () => {
    const { server, file } = await serve({ maxPending: 2, handshakeMs: 300 });
    const idle = [rawSession(server.endpoint), rawSession(server.endpoint)];
    await new Promise((resolve) => setTimeout(resolve, 50));
    const extra = rawSession(server.endpoint);
    await extra.closed;
    await Promise.all(idle.map((session) => session.closed));
    await expect(client(file).request(ROUTES.add, 3, 4)).resolves.toBe(7);
  });

  it('bounds the message size on both sides', async () => {
    const { server, file } = await serve({ maxMessageBytes: 512 });
    const flood = rawSession(server.endpoint);
    flood.send('x'.repeat(1024));
    expect(await flood.next()).toEqual({ id: null, ok: false, error: 'the message is larger than the bridge allows' });
    await expect(client(file).request(ROUTES.echo, 'y'.repeat(600))).rejects.toThrow('the message is larger than the bridge allows');
    await expect(client(file).request(ROUTES.echo, 'w'.repeat(100))).resolves.toBe('w'.repeat(100));
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

describe('bridge handlers', () => {
  it('checks arguments with the route validator before the handler runs', async () => {
    const { server, file } = await serve();
    const handler = vi.fn((n: number) => n * 2);
    const double = invoke<(n: number) => Promise<number>>()('test:double');
    server.handle(double, handler, { validate: (args) => args.length === 1 && Number.isInteger(args[0]) });
    await expect(client(file).request(double, 21)).resolves.toBe(42);
    await expect(client(file).request(double, 'twenty' as never)).rejects.toThrow('invalid arguments for "test:double"');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('masks handler errors unless the handler throws a BridgeError', async () => {
    const onError = vi.fn();
    const { server, file } = await serve({ onError });
    const leaky = invoke<() => Promise<void>>()('test:leaky');
    const plain = invoke<() => Promise<void>>()('test:plain');
    server.handle(leaky, () => {
      throw new Error('C:\\Users\\me\\secret.txt is locked');
    });
    server.handle(plain, () => {
      throw new BridgeError('no document is open');
    });
    await expect(client(file).request(leaky)).rejects.toThrow(/^the request failed$/);
    await expect(client(file).request(plain)).rejects.toThrow('no document is open');
    expect(onError).toHaveBeenCalledWith('test:leaky', expect.any(Error));
  });
});
