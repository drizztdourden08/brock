/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { showMainWindow } from '../background/show-main-window';
import { getMainWindow } from './get-main-window';
import type { MainWindowControl } from './main-window-control.type';

const createWindowControl = (): MainWindowControl =>
  Object.assign((): BrowserWindow | null => getMainWindow(), { show: showMainWindow });

export { createWindowControl };
