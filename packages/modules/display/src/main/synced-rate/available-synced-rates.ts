/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from '../drivers/display-mode-driver.type';
import { syncedRateMap } from './synced-rate-map';

const availableSyncedRates = (driver: DisplayModeDriver): number[] =>
  [...syncedRateMap(driver).keys()].sort((a, b) => a - b);

export { availableSyncedRates };
