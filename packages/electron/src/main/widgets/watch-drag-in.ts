/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { cursorInApp } from './cursor-in-app';
import { dragInSignal } from './drag-in-signal';
import { resizeSession } from './resize-session';
import type { WidgetWindowEntry } from './widget-windows.type';

const watchDragIn = (id: string, win: BrowserWindow, entry: WidgetWindowEntry): void => {
  win.on('move', () => {
    if (!entry.towed && !resizeSession.active()) dragInSignal.over(id, entry, cursorInApp(id, win));
  });
  win.on('moved', () => {
    if (entry.towed || resizeSession.active()) return;
    const point = cursorInApp(id, win);
    if (point) dragInSignal.drop(id, entry, point);
    else dragInSignal.over(id, entry, null);
  });
};

export { watchDragIn };
