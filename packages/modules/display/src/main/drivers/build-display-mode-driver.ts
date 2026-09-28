/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from './display-mode-driver.type';
import { DRIVER_BUILDERS, HEADLESS_REASON } from './display-mode-driver.constants';
import { createUnsupportedDriver } from './unsupported-driver';

const buildDisplayModeDriver = (headless: boolean): DisplayModeDriver => {
  if (headless) return createUnsupportedDriver(HEADLESS_REASON);
  const build = DRIVER_BUILDERS[process.platform];
  if (!build) return createUnsupportedDriver(`Changing the refresh rate is not available on ${process.platform}.`);
  try {
    return build();
  } catch (error) {
    return createUnsupportedDriver(`The display driver failed to start: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export { buildDisplayModeDriver };
