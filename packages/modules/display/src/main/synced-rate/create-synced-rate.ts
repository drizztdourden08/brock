/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from '../drivers/display-mode-driver.type';
import { applyForFullscreen } from './apply-for-fullscreen';
import { applyPermanently } from './apply-permanently';
import { readSyncedStatus } from './read-synced-status';
import { restoreRate } from './restore-rate';
import type { SyncedRate, SyncedRateState } from './synced-rate.type';

const createSyncedRate = (driver: DisplayModeDriver): SyncedRate => {
  const state: SyncedRateState = { driver, preference: { enabled: false, targetHz: 0 }, rateToRestore: null, lastError: '' };
  return {
    status: () => readSyncedStatus(state),
    setPreference: (next) => {
      const wasEnabled = state.preference.enabled;
      state.preference = next;
      if (wasEnabled && !next.enabled) restoreRate(state);
      return readSyncedStatus(state);
    },
    applyPermanently: (hz) => {
      applyPermanently(state, hz);
      return readSyncedStatus(state);
    },
    onFullscreenChange: (isFullscreen) => {
      if (isFullscreen) applyForFullscreen(state);
      else restoreRate(state);
    },
    restore: () => restoreRate(state),
  };
};

export { createSyncedRate };
