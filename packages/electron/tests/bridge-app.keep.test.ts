/* @layer electron-main @kind test */
import { existsSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { connectBridge } from '../src/bridge';
import type { MainContext } from '../src/main/types/main-context.type';
import { createAppBridge } from '../src/main/bridge/create-app-bridge';
import { helperLaunch } from '../src/main/bridge/helper-launch';
import { ROUTES, closeOpened, tempDir } from './bridge-fixture';

const fakeApp = vi.hoisted(() => ({ once: (): void => undefined, isPackaged: false, getAppPath: (): string => '/app/dist/electron' }));
vi.mock('electron', () => ({ app: fakeApp }));

afterEach(closeOpened);

const appBridge = () => {
  const file = join(tempDir(), 'bxel', 'bridge.json');
  const ctx: MainContext = { product: { id: 'bxel' }, log: vi.fn() } as never;
  const bridge = createAppBridge({ options: { register: (server) => { server.handle(ROUTES.add, (a, b) => a + b); } }, file: () => file, ctx: () => ctx });
  return { bridge, file };
};

describe('opening the app bridge at run time', () => {
  it('opens on demand, closes with its connections and file, and reopens with a new secret and endpoint', async () => {
    const { bridge, file } = appBridge();
    expect(bridge.current()).toBeNull();
    const first = await bridge.open();
    expect(await bridge.open()).toBe(first);
    expect(existsSync(file)).toBe(true);
    const helper = connectBridge({ file });
    expect(await helper.request(ROUTES.add, 2, 2)).toBe(4);
    const waiting = helper.request(ROUTES.add, 1, 1);
    bridge.close();
    await waiting.catch(() => undefined);
    expect(existsSync(file)).toBe(false);
    expect(bridge.current()).toBeNull();
    const second = await bridge.open();
    expect([second.secret === first.secret, second.endpoint === first.endpoint]).toEqual([false, false]);
    expect(await helper.request(ROUTES.add, 3, 4)).toBe(7);
    helper.close();
    bridge.close();
  });

  it('refuses to open with no options, and stops a bridge closed while it opened', async () => {
    const empty = createAppBridge({ options: null, file: () => join(tempDir(), 'x.json'), ctx: () => ({}) as MainContext });
    await expect(empty.open()).rejects.toThrow('needs options');
    const { bridge, file } = appBridge();
    const opening = bridge.open();
    bridge.close();
    await expect(opening).rejects.toThrow('closed while it opened');
    expect(existsSync(file)).toBe(false);
  });

  it('gives a helper launch the discovery file of this app', () => {
    const { bridge } = appBridge();
    expect(helperLaunch('bxel-mcp').env).toEqual({ ELECTRON_RUN_AS_NODE: '1', BROCK_BRIDGE_FILE: bridge.discoveryFile() });
  });
});
