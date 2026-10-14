/* @layer core @kind constants */
import type { HostShell } from '@drizztdourden08/brock-core';
import type { DisplaySettings, SyncedRateStatus } from './display.type';

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  windowMode: 'windowed',
  displayMonitor: '',
  syncedRateInFullscreen: false,
  syncedRateTargetHz: 0,
};

const HOST_DISPLAY_DEFAULTS: Readonly<Record<HostShell, Partial<DisplaySettings>>> = {
  electron: {},
  web: {},
  capacitor: { syncedRateInFullscreen: true },
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

export { DEFAULT_DISPLAY_SETTINGS, HOST_DISPLAY_DEFAULTS, UNSUPPORTED_SYNCED_RATE };
