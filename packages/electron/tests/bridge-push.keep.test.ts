/* @layer electron-main @kind test */
import { createServer, type Socket } from 'net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { event, invoke } from '@drizztdourden08/brock-core/ipc';
import { BRIDGE_CODES, BRIDGE_PROTOCOL, BridgeError, connectBridge } from '../src/bridge';
import type { BridgeCall } from '../src/bridge';
import { bridgeProof } from '../src/main/bridge/bridge-proof';
import { createLineReader } from '../src/main/bridge/line-reader';
import { parseServerMessage } from '../src/main/bridge/parse-server-message';
import { ROUTES, client, closeOpened, discoveryFor, serve, tempDir } from './bridge-fixture';

afterEach(closeOpened);

const CHANGED = event<(doc: string, rev: number) => void>()('test:doc-changed');
const WHO = invoke<() => Promise<string>>()('test:who');

const settle = (ms = 100): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const answerAsServer = (socket: Socket, secret: string, text: string): void => {
  const hello = JSON.parse(text) as { hello?: string };
  if (!hello.hello) return;
  const serverNonce = bridgeProof.nonce();
  const key = bridgeProof.sessionKey(secret, hello.hello, serverNonce);
  const sign = (message: unknown): string => {
    const signedBody = JSON.stringify(message);
    return `${JSON.stringify({ body: signedBody, mac: bridgeProof.message(key, signedBody) })}
`;
  };
  socket.write(`${JSON.stringify({ v: BRIDGE_PROTOCOL, hello: serverNonce, proof: bridgeProof.server(secret, hello.hello, serverNonce) })}
`);
  socket.write(sign({ type: 'ready', connectionId: 'c1' }) + sign({ type: 'push', seq: 2, event: CHANGED.channel, args: ['x', 1] }));
  socket.write(sign({ type: 'push', seq: 2, event: CHANGED.channel, args: ['forged', 2] }));
};

const replayServer = (secret: string) => createServer((socket) => {
  socket.on('data', createLineReader(4096, (text) => answerAsServer(socket, secret, text), () => undefined));
});

describe('bridge connections', () => {
  it('gives handlers a stable connection id and tells main when clients open and close', async () => {
    const { server, file } = await serve();
    const opened = vi.fn();
    const closed = vi.fn();
    server.onOpen(opened);
    server.onClose(closed);
    server.handleWith(WHO, (call: BridgeCall) => call.connectionId);
    const first = client(file);
    const second = client(file);
    const ids = [await first.connect(), await second.connect()];
    expect(new Set(ids).size).toBe(2);
    expect(await first.request(WHO)).toBe(ids[0]);
    expect(await first.request(WHO)).toBe(ids[0]);
    expect(await second.request(WHO)).toBe(ids[1]);
    expect(server.connections().sort()).toEqual([...ids].sort());
    expect(opened.mock.calls.map(([id]) => id as unknown)).toEqual(ids);
    first.close();
    await settle();
    expect(closed).toHaveBeenCalledWith(ids[0]);
    expect(server.connections()).toEqual([ids[1]]);
  });
});

describe('bridge push', () => {
  it('sends an event to one connection or to all, signed with each session key', async () => {
    const { server, file } = await serve();
    const first = client(file);
    const second = client(file);
    const heardFirst = vi.fn();
    const heardSecond = vi.fn();
    first.on(CHANGED, heardFirst);
    second.on(CHANGED, heardSecond);
    const firstId = await first.connect();
    await second.connect();
    expect(server.emitTo(firstId, CHANGED, 'a.bxel', 1)).toBe(true);
    expect(server.emitTo('c999', CHANGED, 'a.bxel', 1)).toBe(false);
    expect(server.emit(CHANGED, 'b.bxel', 2)).toBe(2);
    await settle();
    expect(heardFirst.mock.calls).toEqual([['a.bxel', 1], ['b.bxel', 2]]);
    expect(heardSecond.mock.calls).toEqual([['b.bxel', 2]]);
  });

  it('refuses a server message signed with another key and a push out of order', async () => {
    const body = JSON.stringify({ type: 'push', seq: 1, event: CHANGED.channel, args: [] });
    const line = JSON.stringify({ body, mac: bridgeProof.message('the right key', body) });
    expect(parseServerMessage(line, 'the right key')).toEqual({ type: 'push', seq: 1, event: CHANGED.channel, args: [] });
    expect(parseServerMessage(line, 'another key')).toBeNull();
    const secret = 'shared secret';
    const replay = replayServer(secret);
    const endpoint = process.platform === 'win32' ? `\\\\.\\pipe\\brock-replay-${'f'.repeat(32)}` : `${tempDir()}/bridge.sock`;
    await new Promise<void>((resolve) => replay.listen(endpoint, resolve));
    const fake = connectBridge({ file: discoveryFor({ endpoint, secret }) });
    const heard = vi.fn();
    fake.on(CHANGED, heard);
    await fake.connect();
    await settle();
    expect(heard.mock.calls).toEqual([['x', 1]]);
    fake.close();
    replay.close();
  });
});

describe('structured bridge errors', () => {
  it('sends a BridgeError code and data, bounds the data and masks other errors', async () => {
    const { server, file } = await serve();
    const locked = invoke<() => Promise<void>>()('test:locked');
    const huge = invoke<() => Promise<void>>()('test:huge');
    const plain = invoke<() => Promise<void>>()('test:plain');
    server.handle(locked, () => {
      throw new BridgeError('the document is locked', { code: 'doc-locked', data: { path: 'a.bxel', by: 2 } });
    });
    server.handle(huge, () => {
      throw new BridgeError('too much', { code: 'huge', data: 'x'.repeat(70_000) });
    });
    server.handle(plain, () => {
      throw new Error('C:\\private\\path');
    });
    const made = client(file);
    const caught = async (promise: Promise<unknown>): Promise<BridgeError> => promise.then(() => new BridgeError('resolved'), (error: unknown) => error as BridgeError);
    const lockedError = await caught(made.request(locked));
    expect(lockedError).toBeInstanceOf(BridgeError);
    expect([lockedError.message, lockedError.code, lockedError.data]).toEqual(['the document is locked', 'doc-locked', { path: 'a.bxel', by: 2 }]);
    const hugeError = await caught(made.request(huge));
    expect([hugeError.code, hugeError.data]).toEqual(['huge', undefined]);
    const plainError = await caught(made.request(plain));
    expect([plainError.message, plainError.code]).toEqual(['the request failed', BRIDGE_CODES.failed]);
    expect((await caught(made.request(ROUTES.missing))).code).toBe(BRIDGE_CODES.noHandler);
    expect(new BridgeError('x', { code: 'Not A Code' }).code).toBe(BRIDGE_CODES.error);
  });
});
