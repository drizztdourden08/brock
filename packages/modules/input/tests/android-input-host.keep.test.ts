/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/renderer/input-api';

vi.mock('@drizztdourden08/brock-react', () => {
  const api = (): Record<string, unknown> | null => (globalThis as { window?: { api?: Record<string, unknown> } }).window?.api ?? null;
  return {
    hostApi: api,
    exposeHostNamespace: (id: string, value: unknown) => {
      const host = api();
      if (host && !(id in host)) host[id] = value;
    },
  };
});

const nativeWindow = (plugins: Record<string, unknown>, api: Record<string, unknown> = {}) => ({
  api,
  Capacitor: { isNativePlatform: () => true, Plugins: plugins },
});

const loadInputApi = async () => (await import('../src/renderer/input-api')).inputApi;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('inputApi() on each host', () => {
  it('serves the BrockInput plugin on Android and puts it on window.api.input', async () => {
    const plugin = { addListener: vi.fn(() => ({ remove: vi.fn() })), start: vi.fn(() => Promise.resolve({ ok: true, version: '3.4.14' })) };
    const host = nativeWindow({ BrockInput: plugin });
    vi.stubGlobal('window', host);
    const api = (await loadInputApi())();
    expect(api).not.toBeNull();
    expect(host.api.input).toBe(api);
    expect(await api?.status()).toEqual({ available: true, sdlVersion: '3.4.14' });
  });

  it('keeps the preload namespace on the desktop', async () => {
    const preload = { status: vi.fn() };
    vi.stubGlobal('window', { api: { input: preload } });
    expect((await loadInputApi())()).toBe(preload);
  });

  it('is null in a browser and in an Android build without the plugin', async () => {
    vi.stubGlobal('window', { api: {} });
    expect((await loadInputApi())()).toBeNull();
    vi.resetModules();
    vi.stubGlobal('window', nativeWindow({}));
    expect((await loadInputApi())()).toBeNull();
  });
});
