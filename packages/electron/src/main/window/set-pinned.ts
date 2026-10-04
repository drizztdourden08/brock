/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { pinLevel } from './pin-level';

const setPinned = (win: BrowserWindow, on: boolean): void => {
  win.setAlwaysOnTop(on, pinLevel(process.platform));
};

export { setPinned };
