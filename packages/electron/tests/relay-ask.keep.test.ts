/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { ask } from '@drizztdourden08/brock-core/ipc';
import type { AskOutcome } from '@drizztdourden08/brock-core/ipc';
import { BridgeError } from '../src/bridge';
import { acceptAskReply } from '../src/main/ipc/accept-ask-reply';
import { relayAsk } from '../src/main/bridge/relay-ask';
import { client, closeOpened, serve } from './bridge-fixture';

const DOUBLE = ask<(value: number) => Promise<number>>()('relay-test:double');
const SENDER_ID = 11;

const windowAnswering = (answer: (args: unknown[]) => AskOutcome | null) => {
  const contents = Object.assign(new EventEmitter(), {
    id: SENDER_ID,
    isDestroyed: () => false,
    send: (_channel: string, id: number, _name: string, args: unknown[]) => {
      const outcome = answer(args);
      if (outcome) acceptAskReply(SENDER_ID, id, outcome);
    },
  });
  return { webContents: contents, isDestroyed: () => false } as never;
};

const doubling = windowAnswering(([value]) => ({ ok: true, value: Number(value) * 2 }));

afterEach(closeOpened);

describe('relayAsk', () => {
  it('lets a helper call an ask channel and returns the renderer answer', async () => {
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => doubling });
    const helper = client(file);
    const answer = helper.request(DOUBLE, 21);
    expectTypeOf(answer).toEqualTypeOf<Promise<number>>();
    await expect(answer).resolves.toBe(42);
  });

  it('checks the arguments before the window is asked', async () => {
    const asked: unknown[][] = [];
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => windowAnswering((args) => { asked.push(args); return { ok: true, value: 0 }; }), validate: ([value]) => typeof value === 'number' });
    await expect(client(file).request(DOUBLE, 'x' as never)).rejects.toThrow('invalid arguments for "relay-test:double"');
    expect(asked).toEqual([]);
  });

  it('answers with a coded error when no window is open', async () => {
    const { server, file } = await serve();
    relayAsk(server, DOUBLE, { window: () => null });
    const failure = await client(file).request(DOUBLE, 1).catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(BridgeError);
    expect(failure).toMatchObject({ message: 'no window is open to answer', code: 'no-window' });
  });

  it('hides what the renderer handler threw and what a silent window did', async () => {
    const { server, file } = await serve();
    let outcome: AskOutcome | null = { ok: false, message: 'C:\\Users\\me\\secret.txt is locked' };
    relayAsk(server, DOUBLE, { window: () => windowAnswering(() => outcome), timeoutMs: 30 });
    const helper = client(file);
    await expect(helper.request(DOUBLE, 1)).rejects.toThrow('the request failed');
    outcome = null;
    await expect(helper.request(DOUBLE, 1)).rejects.toThrow('the request failed');
  });

  it('is one handler per channel, and returns the unregister call', async () => {
    const { server } = await serve();
    const stop = relayAsk(server, DOUBLE, { window: () => doubling });
    expect(() => relayAsk(server, DOUBLE, { window: () => doubling })).toThrow('already handles "relay-test:double"');
    stop();
    expect(() => relayAsk(server, DOUBLE, { window: () => doubling })).not.toThrow();
  });
});
