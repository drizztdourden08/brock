/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { showMainWindow } from '../background/show-main-window';
import { bootState } from '../boot/boot-state';
import { bringOnScreen } from './bring-on-screen';
import { getMainWindow } from './get-main-window';
import type { MainWindowControl } from './main-window-control.type';
import { offScreenWindows } from './off-screen-windows';

const showOnScreen = async (): Promise<void> => {
  const win = getMainWindow();
  if (win && !win.isDestroyed() && bootState.revealed && offScreenWindows.has(win)) {
    await bringOnScreen(win);
    return;
  }
  await showMainWindow();
};

const createWindowControl = (): MainWindowControl =>
  Object.assign((): BrowserWindow | null => getMainWindow(), { show: showOnScreen });

export { createWindowControl };
