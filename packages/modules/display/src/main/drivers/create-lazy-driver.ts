/* @layer electron-main @kind logic */
import type { DisplayModeDriver, DriverBuilder } from './display-mode-driver.type';

const createLazyDriver = (build: DriverBuilder): DisplayModeDriver => {
  let built: DisplayModeDriver | null = null;
  const driver = (): DisplayModeDriver => {
    built ??= build();
    return built;
  };
  return {
    get platform() { return driver().platform; },
    get available() { return driver().available; },
    get unavailableReason() { return driver().unavailableReason; },
    listRates: () => driver().listRates(),
    currentRate: () => driver().currentRate(),
    setRate: (hz) => driver().setRate(hz),
  };
};

export { createLazyDriver };
