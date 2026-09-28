/* @layer renderer-shell @kind types */
import type { MonitorInfo, SyncedRateStatus, WindowMode, WindowModeState } from '../display.type';

interface DisplayState {
  status: SyncedRateStatus;
  monitors: MonitorInfo[];
  windowMode: WindowModeState | null;
  applying: boolean;
  refresh: () => Promise<void>;
  setSyncedPreference: (enabled: boolean, targetHz: number) => Promise<void>;
  applyRate: (hz: number) => Promise<void>;
  setWindowMode: (mode: WindowMode, monitorId: string | null) => Promise<void>;
}

export type { DisplayState };
