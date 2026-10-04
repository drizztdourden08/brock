/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { getMainWindow } from '../window/get-main-window';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';

const anyWindow = (id: string): BrowserWindow | null => {
  const win = id === MAIN_ANCHOR ? getMainWindow() : widgetWindowEntries.get(id)?.win ?? null;
  return win && !win.isDestroyed() ? win : null;
};

export { anyWindow };
