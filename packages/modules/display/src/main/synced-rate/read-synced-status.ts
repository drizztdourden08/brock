/* @layer electron-main @kind logic */
import type { SyncedRateStatus } from '../../display.type';
import { bestSyncedRate } from '../../rates/best-synced-rate';
import { availableSyncedRates } from './available-synced-rates';
import { resolveTarget } from './resolve-target';
import type { SyncedRateState } from './synced-rate.type';

const readSyncedStatus = (state: SyncedRateState): SyncedRateStatus => {
  const { driver, rateToRestore, lastError } = state;
  const currentHz = driver.currentRate();
  return {
    supported: driver.available,
    unsupportedReason: driver.unavailableReason,
    availableRates: driver.available ? availableSyncedRates(driver) : [],
    currentHz,
    activeHz: rateToRestore !== null ? resolveTarget(state) : null,
    bestHz: bestSyncedRate(currentHz),
    lastError,
  };
};

export { readSyncedStatus };
