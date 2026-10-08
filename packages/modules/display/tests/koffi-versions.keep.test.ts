/* @layer electron-main @kind test */
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import type { Koffi } from '../src/main/drivers/koffi/koffi.type';
import { loadKoffi } from '../src/main/drivers/koffi/load-koffi';
import { devModeStruct } from '../src/main/drivers/windows/devmode-struct';
import { createWindowsDriver } from '../src/main/drivers/windows/windows-driver';
import { ENUM_CURRENT_SETTINGS, ENUM_SIGNATURE } from '../src/main/drivers/windows/windows.constants';
import type { DevMode } from '../src/main/drivers/windows/windows.type';

const DEVMODEW_BYTES = 220;
const CDS_TEST = 0x00000002;
const TEST_SIGNATURE = 'long __stdcall ChangeDisplaySettingsExW(const char16_t *lpszDeviceName, _In_ DEVMODEW *lpDevMode, void *hwnd, uint32_t dwflags, void *lParam)';
const onWindows = process.platform === 'win32';

const requireHere = createRequire(import.meta.url);
const koffiOf = (id: string): Koffi & { version: string } => requireHere(id) as Koffi & { version: string };

const emptyMode = (): DevMode => ({ dmSize: DEVMODEW_BYTES, dmPelsWidth: 0, dmPelsHeight: 0, dmDisplayFrequency: 0, dmFields: 0 });

const readCurrentMode = (koffi: Koffi): { mode: DevMode; found: unknown; accepted: unknown } => {
  const user32 = koffi.load('user32.dll');
  const mode = emptyMode();
  const found = user32.func(ENUM_SIGNATURE)(null, ENUM_CURRENT_SETTINGS, mode);
  const accepted = user32.func(TEST_SIGNATURE)(null, mode, null, CDS_TEST, null);
  return { mode, found, accepted };
};

describe('koffi 3, through the display driver', () => {
  const koffi = koffiOf('koffi');

  it('is the koffi the driver loads', () => {
    expect(koffi.version.startsWith('3.')).toBe(true);
    expect(loadKoffi()).toBe(koffi);
  });

  it.runIf(onWindows)('reads the refresh rates and the current mode', () => {
    const driver = createWindowsDriver();
    expect(driver.unavailableReason).toBe('');
    const current = driver.currentRate();
    expect(current).toBeGreaterThan(0);
    expect(driver.listRates()).toContain(current);
    expect(koffi.sizeof('DEVMODEW')).toBe(DEVMODEW_BYTES);
    const { mode, found, accepted } = readCurrentMode(koffi);
    expect(Boolean(found)).toBe(true);
    expect(mode.dmDisplayFrequency).toBe(current);
    expect(accepted).toBe(0);
  });

  it.runIf(!onWindows)('lays out DEVMODEW at its Win32 size', () => {
    expect(koffi.sizeof(devModeStruct(koffi))).toBe(DEVMODEW_BYTES);
  });
});

describe('koffi 2, with the same declarations', () => {
  const koffi = koffiOf('koffi-v2');
  const struct = devModeStruct(koffi);

  it('lays out DEVMODEW at its Win32 size', () => {
    expect(koffi.version.startsWith('2.')).toBe(true);
    expect(koffi.sizeof(struct)).toBe(DEVMODEW_BYTES);
  });

  it.runIf(onWindows)('fills the current mode in place and passes it back', () => {
    const { mode, found, accepted } = readCurrentMode(koffi);
    expect(Boolean(found)).toBe(true);
    expect(mode.dmPelsWidth).toBeGreaterThan(0);
    expect(mode.dmDisplayFrequency).toBeGreaterThan(0);
    expect(accepted).toBe(0);
  });
});
