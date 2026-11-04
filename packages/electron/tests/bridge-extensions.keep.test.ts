/* @layer electron-main @kind test */
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { connectBridge } from '../src/bridge';
import type { MainContext } from '../src/main/types/main-context.type';
import { opensBridgeOnBoot } from '../src/main/bootstrap/opens-bridge-on-boot';
import { createAppBridge } from '../src/main/bridge/create-app-bridge';
import { mergeBridgeOptions } from '../src/main/bridge/merge-bridge-options';
import { ROUTES, closeOpened, tempDir } from './bridge-fixture';

const fakeApp = vi.hoisted(() => ({ once: (): void => undefined, isPackaged: false, getAppPath: (): string => '/app/dist/electron' }));
vi.mock('electron', () => ({ app: fakeApp }));

afterEach(closeOpened);

const appBridge = (withOptions: boolean) => {
  const file = join(tempDir(), 'bxel', 'bridge.json');
  const ctx: MainContext = { product: { id: 'bxel' }, log: vi.fn() } as never;
  const options = withOptions ? { register: (server: { handle: (route: typeof ROUTES.add, run: (a: number, b: number) => number) => void }) => { server.handle(ROUTES.add, (a, b) => a + b); } } : null;
  const bridge = createAppBridge({ options, file: () => file, ctx: () => ctx });
  return { bridge, file };
};

describe('I-131 bridge extensions', { tags: ['standard'] }, () => {
  it('merges the registers in order and takes the largest limit of any party', async () => {
    const order: string[] = [];
    const base = { register: () => { order.push('app'); }, maxMessageBytes: 100, maxClients: 3 };
    const one = { id: 'one', register: () => { order.push('one'); }, maxMessageBytes: 500, maxBufferedBytes: 900 };
    const two = { id: 'two', register: () => { order.push('two'); }, maxBufferedBytes: 200 };
    const merged = mergeBridgeOptions(base, [one, two]);
    await merged?.register({} as never, {} as never);
    expect(order).toEqual(['app', 'one', 'two']);
    expect([merged?.maxMessageBytes, merged?.maxBufferedBytes, merged?.maxClients]).toEqual([500, 900, 3]);
    expect(mergeBridgeOptions(null, [])).toBeNull();
    expect(mergeBridgeOptions(null, [two])?.maxMessageBytes).toBeUndefined();
  });

  it('opens with no app option once an extension exists, and keeps its routes after close and reopen', async () => {
    const { bridge, file } = appBridge(false);
    await expect(bridge.open()).rejects.toThrow('bridge extension');
    const remove = bridge.extend({ id: 'math', register: (server) => { server.handle(ROUTES.add, (a, b) => a + b); } });
    expect(() => bridge.extend({ id: 'math', register: () => undefined })).toThrow('already added');
    await bridge.open();
    const client = connectBridge({ file });
    expect(await client.request(ROUTES.add, 2, 3)).toBe(5);
    bridge.close();
    await bridge.open();
    expect(await client.request(ROUTES.add, 4, 3)).toBe(7);
    client.close();
    bridge.close();
    remove();
    await expect(bridge.open()).rejects.toThrow('bridge extension');
  });

  it('runs an extension after the app register on the same server', async () => {
    const { bridge, file } = appBridge(true);
    bridge.extend({ id: 'echo', register: (server) => { server.handle(ROUTES.echo, (text) => `echo ${text}`); } });
    await bridge.open();
    const client = connectBridge({ file });
    expect([await client.request(ROUTES.add, 1, 1), await client.request(ROUTES.echo, 'x')]).toEqual([2, 'echo x']);
    client.close();
    bridge.close();
  });

  it('opens on boot when an extension asks, and an explicit app openOnBoot false wins', () => {
    const { bridge } = appBridge(false);
    expect(bridge.extensionsAskForBoot()).toBe(false);
    const remove = bridge.extend({ id: 'boot', register: () => undefined, openOnBoot: true });
    expect(bridge.extensionsAskForBoot()).toBe(true);
    remove();
    expect(bridge.extensionsAskForBoot()).toBe(false);
    const register = () => undefined;
    expect([opensBridgeOnBoot(undefined, false), opensBridgeOnBoot(undefined, true), opensBridgeOnBoot({ register }, false)]).toEqual([false, true, true]);
    expect([opensBridgeOnBoot({ register, openOnBoot: false }, true), opensBridgeOnBoot({ register, openOnBoot: true }, false)]).toEqual([false, true]);
  });
});
