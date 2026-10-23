/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { ask as askChannel, defineChannels } from '@drizztdourden08/brock-core/ipc';
import type { AskContractOf } from '@drizztdourden08/brock-core/ipc';
import { ask } from '../src/main/ipc/ask';
import { askWithin } from '../src/main/ipc/ask-within';
import { acceptAskReply } from '../src/main/ipc/accept-ask-reply';
import type { AskFn } from '../src/main/ipc/ask.type';
import { createAnswerer } from '../src/preload/create-answerer';
import type { SendFn, SubscribeFn } from '../src/preload/bridge.type';

const TEST_CHANNELS = defineChannels({
  double: askChannel<(value: number) => Promise<number>>()('ask-test:double'),
  snapshot: askChannel<(id: string) => Promise<{ id: string; text: string }>>()('ask-test:snapshot'),
});

declare module '@drizztdourden08/brock-core/augment' {
  interface AskContract extends AskContractOf<typeof TEST_CHANNELS> {}
}

type RequestListener = (id: number, channel: string, args: unknown[]) => void;

const SENDER_ID = 7;

const createRenderer = () => {
  const answerListeners: RequestListener[] = [];
  const listen: SubscribeFn = (channel, callback) => {
    if (channel === 'ask:request') answerListeners.push(callback as RequestListener);
    return () => undefined;
  };
  const reply: SendFn = (channel, ...args) => {
    if (channel === 'ask:reply') acceptAskReply(SENDER_ID, ...(args as [unknown, unknown]));
  };
  const answer = createAnswerer(listen, reply);
  const deliver: RequestListener = (id, channel, args) => answerListeners.forEach((listener) => listener(id, channel, args));
  return { answer, deliver };
};

const createWindow = (deliver: RequestListener | null) => {
  let destroyed = false;
  const contents = Object.assign(new EventEmitter(), {
    id: SENDER_ID,
    isDestroyed: () => destroyed,
    send: vi.fn((_channel: string, id: number, channel: string, args: unknown[]) => deliver?.(id, channel, args)),
  });
  const win = { webContents: contents, isDestroyed: () => destroyed } as never;
  const close = (): void => {
    destroyed = true;
    contents.emit('destroyed');
  };
  return { win, contents, close };
};

const deferred = (waiting: Array<() => void>, value: number): Promise<number> =>
  new Promise<number>((resolve) => {
    waiting.push(() => resolve(value));
  });

describe('a typed request from main to a renderer window', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps ask channels out of the preload maps and types them by channel', () => {
    expect(TEST_CHANNELS.maps.invoke).toEqual({});
    expect(TEST_CHANNELS.double).toEqual({ kind: 'ask', channel: 'ask-test:double' });
    expectTypeOf<AskContractOf<typeof TEST_CHANNELS>['ask-test:double']>().toEqualTypeOf<(value: number) => Promise<number>>();
    expectTypeOf<AskFn>().toBeFunction();
  });

  it('round trips the arguments and the reply, by entry or by channel string', async () => {
    const renderer = createRenderer();
    renderer.answer('ask-test:double', (value: number) => value * 2);
    renderer.answer('ask-test:snapshot', (id: string) => Promise.resolve({ id, text: `doc ${id}` }));
    const { win, contents } = createWindow(renderer.deliver);
    await expect(ask(win, TEST_CHANNELS.double, 21)).resolves.toBe(42);
    await expect(ask(win, 'ask-test:snapshot', 'a')).resolves.toEqual({ id: 'a', text: 'doc a' });
    expect(contents.send).toHaveBeenCalledWith('ask:request', 1, 'ask-test:double', [21]);
    expect(contents.send).toHaveBeenCalledWith('ask:request', 2, 'ask-test:snapshot', ['a']);
  });

  it('correlates answers that come back out of order', async () => {
    const waiting: Array<() => void> = [];
    const renderer = createRenderer();
    renderer.answer('ask-test:double', (value: number) => deferred(waiting, value * 2));
    const { win } = createWindow(renderer.deliver);
    const first = ask(win, 'ask-test:double', 1);
    const second = ask(win, 'ask-test:double', 2);
    waiting[1]?.();
    waiting[0]?.();
    await expect(second).resolves.toBe(4);
    await expect(first).resolves.toBe(2);
  });

});

describe('a request that fails', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects with a clear error when the renderer never answers', async () => {
    const { win } = createWindow(null);
    const pending = askWithin(500, win, 'ask-test:double', 1);
    const outcome = expect(pending).rejects.toThrow('ask "ask-test:double" timed out after 500 ms');
    await vi.advanceTimersByTimeAsync(500);
    await outcome;
  });

  it('rejects when no handler is registered in that window', async () => {
    const renderer = createRenderer();
    const { win } = createWindow(renderer.deliver);
    await expect(ask(win, 'ask-test:double', 1)).rejects.toThrow('no handler is registered for "ask-test:double"');
  });

  it('rejects once the handler is unregistered', async () => {
    const renderer = createRenderer();
    const stop = renderer.answer('ask-test:double', (value: number) => value);
    const { win } = createWindow(renderer.deliver);
    await expect(ask(win, 'ask-test:double', 3)).resolves.toBe(3);
    stop();
    await expect(ask(win, 'ask-test:double', 3)).rejects.toThrow('no handler');
  });

  it('rejects with the message of a handler that throws', async () => {
    const renderer = createRenderer();
    renderer.answer('ask-test:double', () => {
      throw new Error('the engine is not ready');
    });
    const { win } = createWindow(renderer.deliver);
    await expect(ask(win, 'ask-test:double', 1)).rejects.toThrow('the engine is not ready');
  });

  it('rejects with the message of a handler that rejects', async () => {
    const renderer = createRenderer();
    renderer.answer('ask-test:snapshot', () => Promise.reject(new Error('no such document')));
    const { win } = createWindow(renderer.deliver);
    await expect(ask(win, 'ask-test:snapshot', 'x')).rejects.toThrow('no such document');
  });

  it('rejects at once when the window closes while it waits', async () => {
    const { win, close } = createWindow(null);
    const pending = ask(win, 'ask-test:double', 1);
    const outcome = expect(pending).rejects.toThrow('the window closed before it answered');
    close();
    await outcome;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects when the window is already closed', async () => {
    const { win, close } = createWindow(null);
    close();
    await expect(ask(win, 'ask-test:double', 1)).rejects.toThrow('the window is closed');
  });

});

describe('which window answers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks only the window it is given', async () => {
    const left = createRenderer();
    const right = createRenderer();
    left.answer('ask-test:double', (value: number) => value + 100);
    right.answer('ask-test:double', (value: number) => value + 200);
    const first = createWindow(left.deliver);
    const second = createWindow(right.deliver);
    await expect(ask(second.win, 'ask-test:double', 1)).resolves.toBe(201);
    await expect(ask(first.win, 'ask-test:double', 1)).resolves.toBe(101);
  });

  it('ignores a reply from another sender and a late reply', async () => {
    const { win, contents } = createWindow(null);
    const pending = askWithin(500, win, 'ask-test:double', 1);
    const outcome = expect(pending).rejects.toThrow('timed out');
    const id = contents.send.mock.calls[0]?.[1] ?? 0;
    acceptAskReply(SENDER_ID + 1, id, { ok: true, value: 99 });
    await vi.advanceTimersByTimeAsync(500);
    await outcome;
    acceptAskReply(SENDER_ID, id, { ok: true, value: 99 });
  });
});
