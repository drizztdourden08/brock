/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { getDisplay } from './display-main';
import { registerDisplayHandlers } from './handlers';
import { watchScreen } from './watch-screen';
import { watchWindow } from './watch-window';

const displayMain: MainModule = {
  id: 'display',
  register: (ctx) => {
    registerDisplayHandlers(ctx, getDisplay(ctx));
    watchScreen(ctx.emit);
  },
  onWindow: (win, ctx) => {
    watchWindow(win, ctx, getDisplay(ctx));
  },
  onWillQuit: (ctx) => {
    getDisplay(ctx).syncedRate.restore();
  },
};

export default displayMain;
export { displayMain, getDisplay };
export { listMonitors } from './window-mode/list-monitors';
export type { DisplayMain } from './display-main.type';
export type { DisplayModeDriver } from './drivers/display-mode-driver.type';
export type { SyncedRate, SyncedRatePreference } from './synced-rate/synced-rate.type';
export type { WindowModeControl } from './window-mode/window-mode.type';
export type {
  RefreshRateInfo, SyncedRateStatus, MonitorInfo, WindowModeState, WindowMode,
} from '../display.type';
