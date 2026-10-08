/* @layer electron-main @kind logic */
import { syncedRateMap } from '../../rates/synced-rate-map';
import type { SyncedRateState } from './synced-rate.type';

const permanentFailure = (state: SyncedRateState, hz: number): string | null => {
  const { driver } = state;
  if (!driver.available) return driver.unavailableReason;
  const exactRate = syncedRateMap(driver.listRates()).get(hz);
  if (exactRate === undefined) return `This display does not offer ${hz} Hz.`;
  if (!driver.setRate(exactRate)) return `The system refused to switch this display to ${hz} Hz.`;
  state.rateToRestore = null;
  return null;
};

const applyPermanently = (state: SyncedRateState, hz: number): void => {
  state.lastError = permanentFailure(state, hz) ?? '';
};

export { applyPermanently };
