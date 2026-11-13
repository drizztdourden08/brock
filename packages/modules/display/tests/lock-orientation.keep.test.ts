/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { lockOrientation } from '../src/renderer/lock-orientation';

const nativeHost = (plugin: Record<string, unknown>) => ({
  Capacitor: { isNativePlatform: () => true, Plugins: { BrockDisplay: plugin } },
});

describe('lockOrientation over the BrockDisplay plugin', { tags: ['critical'] }, () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does nothing off Android', async () => {
    vi.stubGlobal('window', {});
    expect(await lockOrientation('landscape')).toBe(false);
  });

  it('asks the plugin for the mode and reports whether it applied', async () => {
    const lock = vi.fn(() => Promise.resolve({ applied: true }));
    vi.stubGlobal('window', nativeHost({ lockOrientation: lock }));
    expect(await lockOrientation('portrait')).toBe(true);
    expect(lock).toHaveBeenCalledWith({ mode: 'portrait' });
  });

  it('reports false when the native build has no lockOrientation', async () => {
    vi.stubGlobal('window', nativeHost({}));
    expect(await lockOrientation('any')).toBe(false);
  });
});
