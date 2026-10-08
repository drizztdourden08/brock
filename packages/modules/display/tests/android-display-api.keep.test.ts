/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { BrockDisplayPlugin, NativeDisplayInfo } from '../src/renderer/android/android-display.type';
import { createAndroidDisplayApi } from '../src/renderer/android/create-android-display-api';

const fakePlugin = (info: Partial<NativeDisplayInfo> = {}, applied = true) => {
  const listeners: (() => void)[] = [];
  const plugin = {
    addListener: vi.fn((_name: string, listener: () => void) => {
      listeners.push(listener);
      return { remove: vi.fn() };
    }),
    getDisplayInfo: vi.fn(() => Promise.resolve({
      currentHz: 90, supportedHz: [59.94, 90, 120], preferredHz: 0, width: 2400, height: 1080, density: 2.75, ...info,
    })),
    setPreferredRate: vi.fn(() => Promise.resolve(applied ? { applied: true } : { applied: false, reason: 'no window' })),
  } satisfies BrockDisplayPlugin;
  return { plugin, fire: () => { for (const listener of listeners) listener(); } };
};

describe('the Android display API over the BrockDisplay plugin', () => {
  it('reads the panel rates and offers its multiples of 60', async () => {
    const api = createAndroidDisplayApi(fakePlugin().plugin);
    expect(await api.getRefreshRate()).toEqual({ reportedHz: 90, measuredHz: null, modes: [59.94, 90, 120].map((hz) => ({ hz, sameResolution: true })) });
    expect(await api.getSyncedRateStatus()).toMatchObject({ supported: true, availableRates: [60, 120], currentHz: 90, bestHz: 60, activeHz: null });
  });

  it('asks for the highest synced rate when the preference turns on, and clears it when it turns off', async () => {
    const { plugin } = fakePlugin();
    const api = createAndroidDisplayApi(plugin);
    expect((await api.setSyncedRatePreference(true, 0)).activeHz).toBe(120);
    expect(plugin.setPreferredRate).toHaveBeenLastCalledWith({ hz: 120 });
    expect((await api.setSyncedRatePreference(false, 0)).activeHz).toBeNull();
    expect(plugin.setPreferredRate).toHaveBeenLastCalledWith({ hz: 0 });
  });

  it('asks for the rate the display reports, not the rounded one', async () => {
    const { plugin } = fakePlugin();
    const api = createAndroidDisplayApi(plugin);
    expect((await api.applyRefreshRate(60)).lastError).toBe('');
    expect(plugin.setPreferredRate).toHaveBeenLastCalledWith({ hz: 59.94 });
  });

  it('says why when the display lacks the rate or Android refuses it', async () => {
    const missing = createAndroidDisplayApi(fakePlugin().plugin);
    expect((await missing.applyRefreshRate(144)).lastError).toBe('This display does not offer 144 Hz.');
    const odd = createAndroidDisplayApi(fakePlugin({ supportedHz: [90] }).plugin);
    expect((await odd.setSyncedRatePreference(true, 0)).lastError).toBe('This display offers no refresh rate that is a multiple of 60.');
    const refused = createAndroidDisplayApi(fakePlugin({}, false).plugin);
    expect(await refused.setSyncedRatePreference(true, 120)).toMatchObject({ activeHz: null, lastError: 'no window' });
  });

  it('lists one screen, keeps the window full screen and passes display changes on', async () => {
    const { plugin, fire } = fakePlugin();
    const api = createAndroidDisplayApi(plugin);
    expect(await api.listMonitors()).toEqual([{ id: 'android', label: 'This screen', primary: true, width: 2400, height: 1080, scaleFactor: 2.75, refreshHz: 90 }]);
    expect(await api.setWindowMode('windowed', null)).toEqual({ mode: 'fullscreen', monitorId: null, lastError: '' });
    const changed = vi.fn();
    api.onChanged(changed);
    await vi.waitFor(() => { expect(plugin.addListener).toHaveBeenCalledWith('changed', expect.any(Function)); });
    fire();
    expect(changed).toHaveBeenCalledTimes(1);
  });
});
