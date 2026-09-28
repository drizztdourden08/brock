/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from '../display-mode-driver.type';
import { win32Bindings } from './win32-bindings';
import { DM_DISPLAYFREQUENCY, DM_PELSHEIGHT, DM_PELSWIDTH, ENUM_CURRENT_SETTINGS, MAX_MODES } from './windows.constants';
import type { DevMode, Win32Bindings } from './windows.type';

const sameResolution = (a: DevMode, b: DevMode): boolean => a.dmPelsWidth === b.dmPelsWidth && a.dmPelsHeight === b.dmPelsHeight;

const ratesAt = (api: Win32Bindings, current: DevMode): number[] => {
  const rates = new Set<number>();
  for (let i = 0; i < MAX_MODES; i++) {
    const mode = api.enumDisplaySettings(i);
    if (!mode) break;
    if (sameResolution(mode, current)) rates.add(mode.dmDisplayFrequency);
  }
  return [...rates].sort((a, b) => a - b);
};

const listRates = (): number[] => {
  const { api } = win32Bindings();
  const current = api?.enumDisplaySettings(ENUM_CURRENT_SETTINGS);
  return api && current ? ratesAt(api, current) : [];
};

const currentRate = (): number | null =>
  win32Bindings().api?.enumDisplaySettings(ENUM_CURRENT_SETTINGS)?.dmDisplayFrequency ?? null;

const setRate = (hz: number): boolean => {
  const { api } = win32Bindings();
  const current = api?.enumDisplaySettings(ENUM_CURRENT_SETTINGS);
  if (!api || !current) return false;
  const fields = DM_PELSWIDTH | DM_PELSHEIGHT | DM_DISPLAYFREQUENCY;
  return api.changeDisplaySettings({ ...current, dmDisplayFrequency: hz, dmFields: fields });
};

const createWindowsDriver = (): DisplayModeDriver => {
  const { api, error } = win32Bindings();
  return {
    platform: 'win32',
    available: api !== null,
    unavailableReason: api ? '' : error,
    listRates,
    currentRate,
    setRate,
  };
};

export { createWindowsDriver };
