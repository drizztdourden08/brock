/* @layer electron-main @kind logic */
import { BASE_HZ } from '../../rates/rates.constants';
import { isSyncedRate } from '../../rates/is-synced-rate';
import { nearestMultiple } from '../../rates/nearest-multiple';
import type { DisplayModeDriver } from '../drivers/display-mode-driver.type';

const syncedRateMap = (driver: DisplayModeDriver): Map<number, number> => {
  const map = new Map<number, number>();
  for (const hz of driver.listRates()) {
    if (!isSyncedRate(hz)) continue;
    const label = nearestMultiple(hz) * BASE_HZ;
    const best = map.get(label);
    if (best === undefined || Math.abs(hz - label) < Math.abs(best - label)) map.set(label, hz);
  }
  return map;
};

export { syncedRateMap };
