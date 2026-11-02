/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_DISPLAY_SETTINGS } from '../src/display.constants';
import { displayDefaultsFor } from '../src/display-defaults-for';
import { readDisplaySettings } from '../src/renderer/read-display-settings';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('K1 the display defaults per host', { tags: ['critical'] }, () => {
  it('turns the synced rate on for Android, where the app is always full screen', () => {
    expect(displayDefaultsFor('capacitor')).toEqual({ ...DEFAULT_DISPLAY_SETTINGS, syncedRateInFullscreen: true });
  });

  it('reads a missing key as the default of the given host, and a stored one as stored', () => {
    expect(readDisplaySettings({}, 'capacitor').syncedRateInFullscreen).toBe(true);
    expect(readDisplaySettings({}, 'electron').syncedRateInFullscreen).toBe(false);
    expect(readDisplaySettings({ syncedRateInFullscreen: false }, 'capacitor').syncedRateInFullscreen).toBe(false);
    expect(readDisplaySettings({ syncedRateInFullscreen: 'yes' }, 'capacitor').syncedRateInFullscreen).toBe(true);
  });

  it('detects the host when none is given', () => {
    vi.stubGlobal('window', { Capacitor: { isNativePlatform: () => true } });
    expect(readDisplaySettings({}).syncedRateInFullscreen).toBe(true);
    vi.stubGlobal('window', { api: {} });
    expect(readDisplaySettings({}).syncedRateInFullscreen).toBe(false);
  });
});
