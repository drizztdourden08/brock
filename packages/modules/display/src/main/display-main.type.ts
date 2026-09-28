/* @layer electron-main @kind types */
import type { DisplayModeDriver } from './drivers/display-mode-driver.type';
import type { SyncedRate } from './synced-rate/synced-rate.type';
import type { WindowModeControl } from './window-mode/window-mode.type';

interface DisplayMain {
  driver: DisplayModeDriver;
  syncedRate: SyncedRate;
  windowMode: WindowModeControl;
}

export type { DisplayMain };
