/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { FailLoadArgs } from './boot-state.type';
import { armWatchdog } from './arm-watchdog';
import { bootEvents } from './boot-events';
import { bootState } from './boot-state';
import { ABORTED_LOAD, INTERFACE_TASK } from './reveal.constants';
import { reportBootFailure } from './report-boot-failure';

const attachAppWindow = (win: BrowserWindow, present: () => void): void => {
  bootState.app = win;
  bootState.present = present;
  bootState.renderer = null;
  bootState.rendererReady = false;
  bootState.revealed = false;
  win.once('show', () => { bootState.timeline.appShownAt ??= Date.now(); });
  win.once('closed', () => { if (bootState.app === win) bootState.app = null; });
  const { webContents } = win;
  webContents.on('render-process-gone', (_event, details) => {
    reportBootFailure({ ...INTERFACE_TASK, side: 'renderer', message: `The interface process stopped (${details.reason})`, timedOut: false });
  });
  webContents.on('did-fail-load', (...[, code, description, url, isMainFrame]: FailLoadArgs) => {
    if (!isMainFrame || code === ABORTED_LOAD) return;
    reportBootFailure({ ...INTERFACE_TASK, side: 'renderer', message: `${url} did not load: ${description} (${code})`, timedOut: false });
  });
  webContents.on('did-start-loading', armWatchdog);
  webContents.on('dom-ready', armWatchdog);
  armWatchdog();
  bootEvents.emit('window', win);
};

export { attachAppWindow };
