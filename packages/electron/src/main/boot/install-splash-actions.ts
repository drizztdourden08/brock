/* @layer electron-main @kind logic */
import { app, ipcMain } from 'electron';
import type { WebContents } from 'electron';
import { revealLogs } from '../logs/reveal-logs';
import { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import { bootState } from './boot-state';
import { retryBoot } from './retry-boot';

const fromSplash = (sender: WebContents): boolean => bootState.splash?.webContents === sender;

const installSplashActions = (): void => {
  ipcMain.on(SPLASH_CHANNELS.retry, (event) => { if (fromSplash(event.sender)) retryBoot(); });
  ipcMain.on(SPLASH_CHANNELS.quit, (event) => { if (fromSplash(event.sender)) app.quit(); });
  ipcMain.on(SPLASH_CHANNELS.openLogs, (event) => {
    if (fromSplash(event.sender)) void revealLogs();
  });
};

export { installSplashActions };
