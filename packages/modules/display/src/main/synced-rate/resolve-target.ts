/* @layer electron-main @kind logic */
import { syncedTarget } from '../../rates/synced-target';
import type { SyncedRateState } from './synced-rate.type';

const resolveTarget = ({ driver, preference }: SyncedRateState): number | null =>
  syncedTarget(driver.listRates(), preference.targetHz);

export { resolveTarget };
