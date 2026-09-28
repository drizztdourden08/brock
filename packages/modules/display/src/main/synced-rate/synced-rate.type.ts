/* @layer electron-main @kind types */
import type { SyncedRateStatus } from '../../display.type';
import type { DisplayModeDriver } from '../drivers/display-mode-driver.type';

interface SyncedRatePreference {
  enabled: boolean;
  targetHz: number;
}

interface SyncedRateState {
  driver: DisplayModeDriver;
  preference: SyncedRatePreference;
  rateToRestore: number | null;
  lastError: string;
}

interface SyncedRate {
  status: () => SyncedRateStatus;
  setPreference: (next: SyncedRatePreference) => SyncedRateStatus;
  applyPermanently: (hz: number) => SyncedRateStatus;
  onFullscreenChange: (isFullscreen: boolean) => void;
  restore: () => void;
}

export type { SyncedRatePreference, SyncedRateState, SyncedRate };
