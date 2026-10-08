/* @layer core @kind logic */
import { BASE_HZ } from './rates.constants';
import { isSyncedRate } from './is-synced-rate';
import { nearestMultiple } from './nearest-multiple';

const syncedRateMap = (rates: readonly number[]): Map<number, number> => {
  const map = new Map<number, number>();
  for (const hz of rates) {
    if (!isSyncedRate(hz)) continue;
    const label = nearestMultiple(hz) * BASE_HZ;
    const best = map.get(label);
    if (best === undefined || Math.abs(hz - label) < Math.abs(best - label)) map.set(label, hz);
  }
  return map;
};

export { syncedRateMap };
