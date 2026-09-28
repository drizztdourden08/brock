/* @layer core @kind types */
import type { WindowMode } from '@drizztdourden08/brock-core/settings';

interface RateMode {
  hz: number;
  sameResolution: boolean;
}

interface RefreshRateInfo {
  reportedHz: number | null;
  measuredHz: number | null;
  modes: RateMode[];
}

interface SyncedRateStatus {
  supported: boolean;
  unsupportedReason: string;
  availableRates: number[];
  currentHz: number | null;
  activeHz: number | null;
  bestHz: number | null;
  lastError: string;
}

interface MonitorInfo {
  id: string;
  label: string;
  primary: boolean;
  width: number;
  height: number;
  scaleFactor: number;
  refreshHz: number | null;
}

interface WindowModeState {
  mode: WindowMode;
  monitorId: string | null;
  lastError: string;
}

interface DisplaySettings {
  windowMode: WindowMode;
  displayMonitor: string;
  syncedRateInFullscreen: boolean;
  syncedRateTargetHz: number;
}

type DisplayChangedListener = () => void;

interface DisplayApi {
  getRefreshRate: () => Promise<RefreshRateInfo>;
  getSyncedRateStatus: () => Promise<SyncedRateStatus>;
  setSyncedRatePreference: (enabled: boolean, targetHz: number) => Promise<SyncedRateStatus>;
  applyRefreshRate: (hz: number) => Promise<SyncedRateStatus>;
  listMonitors: () => Promise<MonitorInfo[]>;
  getWindowMode: () => Promise<WindowModeState>;
  setWindowMode: (mode: WindowMode, monitorId: string | null) => Promise<WindowModeState>;
  onChanged: (listener: DisplayChangedListener) => () => void;
}

export type {
  RateMode, RefreshRateInfo, SyncedRateStatus, MonitorInfo, WindowModeState, DisplaySettings,
  DisplayChangedListener, DisplayApi, WindowMode,
};
