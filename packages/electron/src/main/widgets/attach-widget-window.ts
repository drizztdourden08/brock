/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { cursorInApp } from './cursor-in-app';
import { dragBounds } from './drag-bounds';
import { settleWindow } from './settle-window';
import { towLinked } from './tow-linked';
import { watchDragIn } from './watch-drag-in';
import { widgetRuntime } from './widget-runtime';
import { widgetWindowControl } from './widget-window-control';
import { zStamps } from './z-stamps';
import type { WidgetWindowEntry } from './widget-windows.type';

const followLive = (id: string, entry: WidgetWindowEntry): void => {
  if (entry.towed || entry.win.isDestroyed()) return;
  const now = boundsOf(entry.win);
  towLinked(id, entry.last, now);
  entry.last = now;
};

const tellClosed = (id: string, entry: WidgetWindowEntry): void => {
  const main = getMainWindow();
  if (main && !widgetRuntime.quitting) emit(main, 'widget:closed', id, entry.closing ? entry.closing.where : 'close', entry.seq);
};

const attachWidgetWindow = (id: string, win: BrowserWindow, entry: WidgetWindowEntry): void => {
  const raise = (): void => {
    entry.zStamp = zStamps.next();
  };
  win.on('will-move', (event, proposed) => {
    if (cursorInApp(id, win)) return;
    const wanted = dragBounds(id, proposed);
    if (!wanted) return;
    event.preventDefault();
    win.setBounds(wanted);
  });
  win.on('move', () => followLive(id, entry));
  win.on('moved', () => settleWindow(id));
  win.on('resized', () => settleWindow(id));
  win.on('focus', raise);
  win.on('show', raise);
  win.on('close', () => entry.report.flush());
  win.on('closed', () => {
    entry.report.cancel();
    widgetWindowControl.unregister(id, win);
    tellClosed(id, entry);
  });
  watchDragIn(id, win, entry);
};

export { attachWidgetWindow };
