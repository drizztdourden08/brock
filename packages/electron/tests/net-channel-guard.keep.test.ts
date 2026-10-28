/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { MainContext } from '../src/main/types/main-context.type';
import { networkHandlers } from '../src/main/network/ipc-handlers';
import { eventOf, senderOf } from './clipboard-fixture';

const request = vi.hoisted(() => vi.fn());

vi.mock('electron', () => ({ net: { request } }));
vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => null }));

type Handler = (event: unknown, ...args: unknown[]) => unknown;

const open = (): Handler => {
  const handlers = new Map<string, Handler>();
  const ctx: Pick<MainContext, 'handle' | 'product'> = {
    product: { id: 'bxel' } as MainContext['product'],
    handle: ((channel: string, fn: Handler) => handlers.set(channel, fn)) as MainContext['handle'],
  };
  networkHandlers.register(ctx as MainContext);
  return handlers.get('net:read') as Handler;
};

describe('net:read frame check', () => {
  it('refuses a call that is not from the app frame, before any request', async () => {
    const read = open();
    const sender = senderOf();
    for (const frame of [null, { origin: 'https://evil.example', url: 'https://evil.example/' }, { origin: 'file://', url: 'file:///other.html' }]) {
      await expect(Promise.resolve().then(() => read(eventOf(sender, frame), 'https://lospec.com/x'))).rejects.toThrow(/Only the app window/);
    }
    expect(request).not.toHaveBeenCalled();
  });

  it('lets the app frame through to the product check', async () => {
    const read = open();
    await expect(Promise.resolve().then(() => read(eventOf(senderOf()), 'https://lospec.com/x'))).rejects.toThrow(/is off/);
    expect(request).not.toHaveBeenCalled();
  });
});
