/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';

const isMainNormal = (main: BrowserWindow): boolean =>
  !main.isDestroyed() && !main.isMinimized() && !main.isMaximized() && !main.isFullScreen();

export { isMainNormal };
