/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { createBoundsReporter } from './create-bounds-reporter';
import { cursorInApp } from './cursor-in-app';
import { dragBounds } from './drag-bounds';
import { settleWindow } from './settle-window';
import { watchDragIn } from './watch-drag-in';
import { widgetWindowClosing } from './widget-window-closing';
import { widgetWindowControl } from './widget-window-control';
import type { WidgetWindowEntry } from './widget-windows.type';

const attachWidgetWindow = (id: string, win: BrowserWindow, entry: WidgetWindowEntry): void => {
  const reporter = createBoundsReporter(id, win);
  const settled = (): void => {
    settleWindow(id);
    reporter.schedule();
  };
  win.on('will-move', (event) => {
    if (cursorInApp(win)) return;
    const wanted = dragBounds(id);
    if (!wanted) return;
    event.preventDefault();
    win.setBounds(wanted);
  });
  win.on('moved', settled);
  win.on('resized', settled);
  win.on('closed', () => {
    reporter.cancel();
    widgetWindowControl.unregister(id);
    const where = widgetWindowClosing.get(id);
    widgetWindowClosing.delete(id);
    const main = getMainWindow();
    if (main) emit(main, 'widget:closed', id, where);
  });
  watchDragIn(id, win, entry);
};

export { attachWidgetWindow };
