/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AndroidInputEvent, BrockInputPlugin } from '../src/renderer/android/android-input.type';
import { createAndroidInputApi } from '../src/renderer/android/create-android-input-api';

const MAPPING = '030000005e0400008e02000000007801,Pad,a:b0,b:b1,platform:Android,';

const added = (id: number, overrides: Partial<Extract<AndroidInputEvent, { type: 'added' }>> = {}): AndroidInputEvent => ({
  type: 'added', id, name: 'Pro Controller', vendorId: 0x057e, productId: 0x2009, guid: 'abc', hasRumble: true, hasGyro: false,
  connectionState: 'wireless', sdlType: 'switch-pro', hasButton: [true], hasAxis: [true], buttonLabels: ['B'], ...overrides,
});

const fakePlugin = (options: { ok?: boolean; onStart?: AndroidInputEvent[] } = {}) => {
  let emit: ((event: AndroidInputEvent) => void) | null = null;
  const removed = vi.fn();
  const plugin = {
    addListener: vi.fn((_name: string, listener: (event: AndroidInputEvent) => void) => {
      emit = listener;
      return Promise.resolve({ remove: removed });
    }),
    start: vi.fn(() => {
      for (const event of options.onStart ?? []) emit?.(event);
      return Promise.resolve({ ok: options.ok ?? true, version: '3.4.14' });
    }),
    stop: vi.fn(() => Promise.resolve()),
    rumble: vi.fn(() => Promise.resolve({ ok: true })),
    addMapping: vi.fn(() => Promise.resolve({ ok: true })),
    mappingForGuid: vi.fn(() => Promise.resolve({ mapping: MAPPING })),
  } satisfies BrockInputPlugin;
  return { plugin, removed, send: (event: AndroidInputEvent) => emit?.(event) };
};

const memoryStorage = (): Storage => {
  const items = new Map<string, string>();
  return {
    get length() { return items.size; },
    key: (i) => [...items.keys()][i] ?? null,
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => { items.set(key, value); },
    removeItem: (key) => { items.delete(key); },
    clear: () => { items.clear(); },
  };
};

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the Android input API over the BrockInput plugin', () => {
  it('listens before it starts, so pads already connected are in the first list', async () => {
    const { plugin } = fakePlugin({ onStart: [added(7)] });
    const api = createAndroidInputApi(plugin);
    expect(await api.status()).toEqual({ available: true, sdlVersion: '3.4.14' });
    expect(plugin.addListener).toHaveBeenCalledBefore(plugin.start);
    const [entry] = await api.list();
    expect(entry).toMatchObject({ deviceKey: '057e:2009', sdlId: 7, status: 'ready', product: 'Pro Controller', busType: 'bluetooth' });
  });

  it('keys a second pad of the same kind #2 and frees the key when it leaves', async () => {
    const { plugin, send } = fakePlugin();
    const api = createAndroidInputApi(plugin);
    const addedKeys: string[] = [];
    const removedKeys: string[] = [];
    const snapshots: number[] = [];
    api.onAdded((info) => addedKeys.push(info.deviceKey));
    api.onRemoved((deviceKey) => removedKeys.push(deviceKey));
    api.onDevices((devices) => snapshots.push(devices.length));
    await api.status();
    send(added(1));
    send(added(2));
    send({ type: 'removed', id: 1 });
    send(added(3));
    expect(addedKeys).toEqual(['057e:2009', '057e:2009#2', '057e:2009']);
    expect(removedKeys).toEqual(['057e:2009']);
    expect(snapshots).toEqual([1, 2, 1, 2]);
  });

  it('sends state by device key and drops state from a pad it never saw', async () => {
    const { plugin, send } = fakePlugin();
    const api = createAndroidInputApi(plugin);
    const states: [string, boolean[], number[]][] = [];
    api.onState((deviceKey, buttons, axes) => states.push([deviceKey, buttons, axes]));
    await api.status();
    send(added(4));
    send({ type: 'state', id: 4, buttons: [true], axes: [0.5] });
    send({ type: 'state', id: 99, buttons: [false], axes: [0] });
    expect(states).toEqual([['057e:2009', [true], [0.5]]]);
  });
});

describe('the Android input API calls into the plugin', () => {
  it('rumbles the SDL id behind a device key, and nothing for an unknown key', async () => {
    const { plugin, send } = fakePlugin();
    const api = createAndroidInputApi(plugin);
    await api.status();
    send(added(5));
    expect(await api.rumble('057e:2009', 0.25, 0.5, 120)).toBe(true);
    expect(plugin.rumble).toHaveBeenCalledWith({ id: 5, low: 0.25, high: 0.5, durationMs: 120 });
    expect(await api.rumble('dead:beef', 1, 1, 10)).toBe(false);
    expect((await api.vibratePattern('dead:beef', [{ durationMs: 10, intensity: 1 }], 0)).ok).toBe(false);
  });

  it('reports controllers off and stops listening when the native side does not start', async () => {
    const { plugin, removed } = fakePlugin({ ok: false });
    const api = createAndroidInputApi(plugin);
    expect(await api.status()).toEqual({ available: false, sdlVersion: null });
    await vi.waitFor(() => { expect(removed).toHaveBeenCalled(); });
  });

  it('keeps an added mapping line and adds it again on the next start', async () => {
    const first = fakePlugin();
    const api = createAndroidInputApi(first.plugin);
    await api.status();
    expect(await api.mapping.add('not a mapping')).toBe(false);
    expect(await api.mapping.add(MAPPING)).toBe(true);
    expect(first.plugin.addMapping).toHaveBeenCalledTimes(1);
    const second = fakePlugin();
    await createAndroidInputApi(second.plugin).status();
    expect(second.plugin.addMapping).toHaveBeenCalledWith({ mapping: MAPPING });
    expect(await api.mapping.forGuid('abc')).toBe(MAPPING);
  });

  it('stores calibration in the WebView and has no raw capture', async () => {
    const api = createAndroidInputApi(fakePlugin().plugin);
    await api.calibration.writeTrigger('057e:2009', 4, { base: 0.1, max: 0.9, deadzone: 0.05 });
    expect(await createAndroidInputApi(fakePlugin().plugin).calibration.readTriggers()).toEqual({ '057e:2009:4': { base: 0.1, max: 0.9, deadzone: 0.05 } });
    expect(await api.capture.startRaw(1, 2)).toMatchObject({ ok: false, reason: 'error' });
    expect(await api.listHid()).toEqual([]);
  });
});
