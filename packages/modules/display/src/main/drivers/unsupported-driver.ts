/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from './display-mode-driver.type';

const createUnsupportedDriver = (reason: string): DisplayModeDriver => ({
  platform: process.platform,
  available: false,
  unavailableReason: reason,
  listRates: () => [],
  currentRate: () => null,
  setRate: () => false,
});

export { createUnsupportedDriver };
