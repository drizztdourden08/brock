/* @layer core @kind logic */
import { syncedRateOptions } from './synced-rate-options';

const bestSyncedRate = (hz: number | null): number | null => syncedRateOptions(hz).at(-1) ?? null;

export { bestSyncedRate };
