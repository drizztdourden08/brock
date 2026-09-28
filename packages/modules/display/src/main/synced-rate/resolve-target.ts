/* @layer electron-main @kind logic */
import { availableSyncedRates } from './available-synced-rates';
import type { SyncedRateState } from './synced-rate.type';

const resolveTarget = ({ driver, preference }: SyncedRateState): number | null => {
  const options = availableSyncedRates(driver);
  if (preference.targetHz > 0) return options.includes(preference.targetHz) ? preference.targetHz : null;
  return options.at(-1) ?? null;
};

export { resolveTarget };
