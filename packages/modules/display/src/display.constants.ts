/* @layer core @kind constants */
import type { DisplaySettings, SyncedRateStatus } from './display.type';

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  windowMode: 'windowed',
  displayMonitor: '',
  syncedRateInFullscreen: false,
  syncedRateTargetHz: 0,
};

const UNSUPPORTED_SYNCED_RATE: SyncedRateStatus = {
  supported: false,
  unsupportedReason: 'Changing the refresh rate needs the desktop app.',
  availableRates: [],
  currentHz: null,
  activeHz: null,
  bestHz: null,
  lastError: '',
};

export { DEFAULT_DISPLAY_SETTINGS, UNSUPPORTED_SYNCED_RATE };
