/* @layer core @kind logic */
import { availableSyncedRates } from './available-synced-rates';

const syncedTarget = (rates: readonly number[], targetHz: number): number | null => {
  const options = availableSyncedRates(rates);
  if (targetHz > 0) return options.includes(targetHz) ? targetHz : null;
  return options.at(-1) ?? null;
};

export { syncedTarget };
