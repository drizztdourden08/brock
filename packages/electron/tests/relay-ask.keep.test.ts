/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { ask } from '@drizztdourden08/brock-core/ipc';
import type { AskOutcome } from '@drizztdourden08/brock-core/ipc';
import { BRIDGE_CODES, BridgeError } from '../src/bridge';
import type { RelayAskOptions } from '../src/main/bridge/app-bridge.type';
import type { BridgeArgsCheck } from '../src/main/bridge/bridge.type';
import { acceptAskReply } from '../src/main/ipc/accept-ask-reply';
import { relayAsk } from '../src/main/bridge/relay-ask';
import { client, closeOpened, serve } from './bridge-fixture';

const DOUBLE = ask<(value: number) => Promise<number>>()('relay-test:double');
const SENDER_ID = 11;
const anyNumber: BridgeArgsCheck = ([value]) => typeof value === 'number';

const windowAround = (send: (id: number, args: unknown[], contents: EventEmitter) => void) => {
  const contents = Object.assign(new EventEmitter(), {
    id: SENDER_ID,
    isDestroyed: () => false,
    send: (_channel: string, id: number, _name: string, args: unknown[]) => send(id, args, contents),
  });
  return { webContents: contents, isDestroyed: () => false } as never;
};

const windowAnswering = (answer: (args: unknown[]) => AskOutcome | null) =>
  windowAround((id, args) => {
    const outcome = answer(args);
    if (outcome) acceptAskReply(SENDER_ID, id, outcome);
  });

const doubling = windowAnswering(([value]) => ({ ok: true, value: Number(value) * 2 }));

afterEach(closeOpened);

describe('relayAsk', () => {
  it('lets a helper call an ask channel and returns the renderer answer', async () => {
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => doubling, validate: anyNumber });
    const answer = client(file).request(DOUBLE, 21);
    expectTypeOf(answer).toEqualTypeOf<Promise<number>>();
    await expect(answer).resolves.toBe(42);
  });

  it('requires an argument check, and runs it before the window is asked', async () => {
    expectTypeOf<RelayAskOptions['validate']>().toEqualTypeOf<BridgeArgsCheck>();
    const asked: unknown[][] = [];
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => windowAnswering((args) => { asked.push(args); return { ok: true, value: 0 }; }), validate: anyNumber });
    await expect(client(file).request(DOUBLE, 'x' as never)).rejects.toThrow('invalid arguments for "relay-test:double"');
    expect(asked).toEqual([]);
  });

  it('answers with a coded error when no window is open', async () => {
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => null, validate: anyNumber });
    const failure = await client(file).request(DOUBLE, 1).catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(BridgeError);
    expect(failure).toMatchObject({ message: 'no window is open to answer', code: 'no-window' });
  });

  it('hides what the renderer handler threw', async () => {
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => windowAnswering(() => ({ ok: false, message: 'C:\\Users\\me\\secret.txt is locked' })), validate: anyNumber });
    await expect(client(file).request(DOUBLE, 1)).rejects.toThrow('the request failed');
  });

  it('reports a silent window as a timeout and a closed window as closed, with fixed messages', async () => {
    const { server, file } = await serve();
    const silent = windowAnswering(() => null);
    const closing = windowAround((_id, _args, contents) => contents.emit('destroyed'));
    let target = silent;
    relayAsk(server, DOUBLE, { window: () => target, validate: anyNumber, timeoutMs: 30 });
    const helper = client(file);
    const timedOut = await helper.request(DOUBLE, 1).catch((error: unknown) => error);
    expect(timedOut).toMatchObject({ message: 'the window did not answer in time', code: BRIDGE_CODES.timeout });
    target = closing;
    const closed = await helper.request(DOUBLE, 1).catch((error: unknown) => error);
    expect(closed).toMatchObject({ message: 'the window closed before it answered', code: BRIDGE_CODES.closed });
  });

});

describe('relayAsk limits', () => {
  it('refuses a ninth request while eight wait for the window, and takes new ones once they are answered', async () => {
    const waiting: number[] = [];
    const mode = { holding: true };
    const { server, file } = await serve();
    const hold = windowAround((id) => {
      if (mode.holding) waiting.push(id);
      else acceptAskReply(SENDER_ID, id, { ok: true, value: 6 });
    });
    relayAsk(server, DOUBLE, { window: () => hold, validate: anyNumber });
    const helper = client(file);
    const held = Array.from({ length: 8 }, () => helper.request(DOUBLE, 1));
    const busy = await helper.request(DOUBLE, 1).catch((error: unknown) => error);
    expect(busy).toMatchObject({ code: BRIDGE_CODES.busy });
    expect(waiting).toHaveLength(8);
    for (const id of waiting) acceptAskReply(SENDER_ID, id, { ok: true, value: 5 });
    await expect(Promise.all(held)).resolves.toEqual(Array.from({ length: 8 }, () => 5));
    mode.holding = false;
    await expect(helper.request(DOUBLE, 1)).resolves.toBe(6);
  });

  it('is one handler per channel, and returns the unregister call', async () => {
    const { server } = await serve();
    const options = { window: () => doubling, validate: anyNumber };
    const stop = relayAsk(server, DOUBLE, options);
    expect(() => relayAsk(server, DOUBLE, options)).toThrow('already handles "relay-test:double"');
    stop();
    expect(() => relayAsk(server, DOUBLE, options)).not.toThrow();
  });
});
