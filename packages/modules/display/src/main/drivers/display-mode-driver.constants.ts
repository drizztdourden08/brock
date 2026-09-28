/* @layer electron-main @kind constants */
import type { DriverBuilder } from './display-mode-driver.type';
import { createLinuxDriver } from './linux/linux-driver';
import { createMacDriver } from './macos/macos-driver';
import { createWindowsDriver } from './windows/windows-driver';

const DRIVER_BUILDERS: Partial<Record<NodeJS.Platform, DriverBuilder>> = {
  win32: createWindowsDriver,
  darwin: createMacDriver,
  linux: createLinuxDriver,
};

const HEADLESS_REASON = 'An automation launch never changes the display.';

export { DRIVER_BUILDERS, HEADLESS_REASON };
