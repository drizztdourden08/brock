/* @layer electron-main @kind logic */
import type { SyncedRateState } from './synced-rate.type';

const restoreRate = (state: SyncedRateState): void => {
  const target = state.rateToRestore;
  if (target === null) return;
  state.rateToRestore = null;
  state.driver.setRate(target);
};

export { restoreRate };
