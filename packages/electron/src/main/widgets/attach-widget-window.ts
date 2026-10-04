/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { cursorInApp } from './cursor-in-app';
import { dragBounds } from './drag-bounds';
import { followGroup } from './follow-group';
import { endResize } from './end-resize';
import { onWillResize } from './on-will-resize';
import { resizeSession } from './resize-session';
import { settleWindow } from './settle-window';
import { towHold } from './tow-hold';
import { towLinked } from './tow-linked';
import { watchDragIn } from './watch-drag-in';
import { watchModifiers } from './watch-modifiers';
import { widgetRuntime } from './widget-runtime';
import { widgetWindowControl } from './widget-window-control';
import { windowGuide } from './window-guide';
import { zStamps } from './z-stamps';
import type { WidgetWindowEntry } from './widget-windows.type';

const followLive = (id: string, entry: WidgetWindowEntry): void => {
  if (entry.towed || entry.win.isDestroyed()) return;
  const now = boundsOf(entry.win);
  if (!towHold.held() && !resizeSession.active()) towLinked(id, entry.last, now);
  entry.last = now;
};

const tellClosed = (id: string, entry: WidgetWindowEntry): void => {
  const main = getMainWindow();
  if (main && !widgetRuntime.quitting) emit(main, 'widget:closed', id, entry.closing ? entry.closing.where : 'close', entry.seq);
};

const watchManipulation = (id: string, win: BrowserWindow): void => {
  win.on('will-move', (event, proposed) => {
    if (cursorInApp(id, win)) return;
    windowGuide.touch('moving');
    const wanted = dragBounds(id, proposed);
    if (!wanted) return;
    event.preventDefault();
    win.setBounds(wanted);
  });
  win.on('will-resize', (event, proposed, details) => {
    windowGuide.touch('resizing');
    onWillResize(id, win, { event, proposed, edge: details.edge });
  });
  win.on('moved', windowGuide.end);
  win.on('resized', () => {
    endResize(id);
    windowGuide.end();
  });
};

const attachWidgetWindow = (id: string, win: BrowserWindow, entry: WidgetWindowEntry): void => {
  const raise = (): void => {
    entry.zStamp = zStamps.next();
  };
  watchManipulation(id, win);
  win.on('move', () => followLive(id, entry));
  win.on('moved', () => settleWindow(id));
  win.on('resized', () => settleWindow(id));
  win.on('focus', raise);
  win.on('show', raise);
  win.on('close', () => entry.report.flush());
  win.on('closed', () => {
    endResize(id);
    entry.report.cancel();
    widgetWindowControl.unregister(id, win);
    tellClosed(id, entry);
  });
  watchDragIn(id, win, entry);
  watchModifiers(win);
  followGroup(id, win);
};

export { attachWidgetWindow };
