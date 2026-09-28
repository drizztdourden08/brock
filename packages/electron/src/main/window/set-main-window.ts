/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { mainWindowRef } from './main-window-ref';

const setMainWindow = (win: BrowserWindow | null): void => {
  mainWindowRef.current = win;
  win?.once('closed', () => {
    if (mainWindowRef.current === win) mainWindowRef.current = null;
  });
};

export { setMainWindow };
