/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { cursorInApp } from './cursor-in-app';
import type { WidgetWindowEntry } from './widget-windows.type';

const watchDragIn = (id: string, win: BrowserWindow, entry: WidgetWindowEntry): void => {
  let over = false;
  const tell = (point: WidgetWindowPoint | null): void => {
    const main = getMainWindow();
    if (!main) return;
    if (point || over) emit(main, 'widget:dragOver', id, point);
    over = point !== null;
  };
  win.on('move', () => {
    if (!entry.towed) tell(cursorInApp(win));
  });
  win.on('moved', () => {
    if (entry.towed) return;
    const point = cursorInApp(win);
    const main = getMainWindow();
    if (point && main) emit(main, 'widget:dropIn', id, point);
    tell(null);
  });
};

export { watchDragIn };
