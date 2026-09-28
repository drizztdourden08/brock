/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { WATCHDOG_MS } from './reveal.constants';
import { revealState } from './reveal-state';
import { revealMainWindow } from './reveal-main-window';

const armReveal = (win: BrowserWindow): void => {
  revealState.target = win;
  revealState.revealed = false;
  win.setIgnoreMouseEvents(true);
  if (revealState.watchdog) clearTimeout(revealState.watchdog);
  revealState.watchdog = setTimeout(revealMainWindow, WATCHDOG_MS);
  win.webContents.on('render-process-gone', revealMainWindow);
};

export { armReveal };
