/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { DisplayMain } from './display-main.type';
import { readRefreshRate } from './read-refresh-rate';
import { listMonitors } from './window-mode/list-monitors';

const registerDisplayHandlers = (ctx: Pick<MainContext, 'handle' | 'window' | 'emit'>, display: DisplayMain): void => {
  const { handle, window, emit } = ctx;
  const { driver, syncedRate, windowMode } = display;
  handle('display:getRefreshRate', () => readRefreshRate(window(), driver));
  handle('display:getSyncedRateStatus', () => syncedRate.status());
  handle('display:setSyncedRatePreference', (_event, enabled, targetHz) => syncedRate.setPreference({ enabled, targetHz }));
  handle('display:applyRefreshRate', (_event, hz) => {
    const status = syncedRate.applyPermanently(hz);
    emit('display:changed');
    return status;
  });
  handle('display:listMonitors', () => listMonitors());
  handle('display:getWindowMode', () => windowMode.read());
  handle('display:setWindowMode', (_event, mode, monitorId) => windowMode.apply(mode, monitorId));
};

export { registerDisplayHandlers };
