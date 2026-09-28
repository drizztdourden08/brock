/* @layer core @kind types */
import type { WindowMode } from '@drizztdourden08/brock-core/settings';
import type { DisplayApi, MonitorInfo, RefreshRateInfo, SyncedRateStatus, WindowModeState } from './display.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'display:getRefreshRate': () => Promise<RefreshRateInfo>;
    'display:getSyncedRateStatus': () => Promise<SyncedRateStatus>;
    'display:setSyncedRatePreference': (enabled: boolean, targetHz: number) => Promise<SyncedRateStatus>;
    'display:applyRefreshRate': (hz: number) => Promise<SyncedRateStatus>;
    'display:listMonitors': () => Promise<MonitorInfo[]>;
    'display:getWindowMode': () => Promise<WindowModeState>;
    'display:setWindowMode': (mode: WindowMode, monitorId: string | null) => Promise<WindowModeState>;
  }

  interface EventContract {
    'display:changed': () => void;
  }

  interface IpcNamespaces {
    display: DisplayApi;
  }
}
