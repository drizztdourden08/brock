/* @layer electron-main @kind test */
import { chmodSync, mkdirSync, readFileSync, symlinkSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { event } from '@drizztdourden08/brock-core/ipc';
import { readBridgeDiscovery, writeBridgeDiscovery } from '../src/bridge';
import type { MainContext } from '../src/main/types/main-context.type';
import { createAppBridge } from '../src/main/bridge/create-app-bridge';
import { ROUTES, client, closeOpened, discoveryOf, handshake, nextFrom, rawSession, serve, signed, tempDir } from './bridge-fixture';

const fakeApp = vi.hoisted(() => ({ once: (): void => undefined }));
vi.mock('electron', () => ({ app: fakeApp }));

afterEach(closeOpened);

const BIG = event<(blob: string) => void>()('test:big');
const posix = process.platform !== 'win32';

describe('a client that never reads', () => {
  it('drops pushes past the buffer cap and closes the connection when a reply cannot be queued', async () => {
    const { server } = await serve({ maxBufferedBytes: 64 * 1024 });
    const slow = rawSession(server.endpoint);
    const key = await handshake(slow, server.secret);
    await nextFrom(slow, key);
    slow.pause();
    const dropped = new Promise((resolve) => server.onClose(resolve));
    const blob = 'x'.repeat(32 * 1024);
    const sent = Array.from({ length: 400 }, () => server.emit(BIG, blob));
    expect(sent).toContain(0);
    expect(sent.indexOf(0)).toBeLessThan(400);
    slow.send(signed(key, 1, ROUTES.echo.channel, ['y'.repeat(40 * 1024)]));
    await dropped;
    expect(server.connections()).toEqual([]);
  });
});

describe('connection listeners and ids', () => {
  it('routes a throwing listener to the error log and keeps serving', async () => {
    const onError = vi.fn();
    const { server, file } = await serve({ onError });
    server.onOpen(() => {
      throw new Error('listener broke');
    });
    const made = client(file);
    expect(await made.request(ROUTES.add, 1, 2)).toBe(3);
    expect(onError).toHaveBeenCalledWith('onOpen listener', expect.any(Error));
    expect(await made.connect()).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe('closing and reopening the app bridge', () => {
  it('lets the last open win and never deletes the live discovery file', async () => {
    const file = join(tempDir(), 'bxel', 'bridge.json');
    const ctx: MainContext = { product: { id: 'bxel' }, log: vi.fn() } as never;
    const bridge = createAppBridge({ options: { register: () => undefined }, file: () => file, ctx: () => ctx });
    const first = bridge.open();
    bridge.close();
    const second = bridge.open();
    await expect(first).rejects.toThrow('closed while it opened');
    const live = await second;
    expect((JSON.parse(readFileSync(file, 'utf8')) as { secret: string }).secret).toBe(live.secret);
    bridge.close();
  });
});

describe('reading the discovery file', () => {
  it.runIf(posix)('refuses a link and a folder anyone can write', async () => {
    const { server } = await serve();
    const folder = join(tempDir(), 'app');
    mkdirSync(folder);
    const real = join(folder, 'real.json');
    writeBridgeDiscovery(real, discoveryOf(server));
    const link = join(folder, 'bridge.json');
    symlinkSync(real, link);
    expect(() => readBridgeDiscovery(link)).toThrow('is a link');
    chmodSync(folder, 0o777);
    expect(() => readBridgeDiscovery(real)).toThrow('open for anyone to write');
    chmodSync(folder, 0o700);
    expect(readBridgeDiscovery(real).endpoint).toBe(server.endpoint);
  });
});
