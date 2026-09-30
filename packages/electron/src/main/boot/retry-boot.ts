/* @layer electron-main @kind logic */
import { app } from 'electron';
import { armWatchdog } from './arm-watchdog';
import { bootState } from './boot-state';
import { relayProgress } from './relay-progress';

const retryBoot = (): void => {
  const { failure, app: win } = bootState;
  if (!failure) return;
  if (failure.side === 'renderer' && bootState.mainDone && win && !win.isDestroyed()) {
    bootState.failure = null;
    bootState.renderer = null;
    bootState.rendererReady = false;
    bootState.shownFraction = 0;
    relayProgress();
    armWatchdog();
    win.webContents.reload();
    return;
  }
  app.relaunch();
  app.exit(0);
};

export { retryBoot };
