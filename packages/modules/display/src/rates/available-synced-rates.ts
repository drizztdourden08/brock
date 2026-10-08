/* @layer core @kind logic */
import { syncedRateMap } from './synced-rate-map';

const availableSyncedRates = (rates: readonly number[]): number[] =>
  [...syncedRateMap(rates).keys()].sort((a, b) => a - b);

export { availableSyncedRates };
