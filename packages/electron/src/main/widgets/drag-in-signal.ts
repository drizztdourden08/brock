/* @layer electron-main @kind logic */
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { DRAG_FADE_OPACITY } from './widget-windows.constants';
import type { WidgetWindowEntry } from './widget-windows.type';

const fade = (entry: WidgetWindowEntry, on: boolean): void => {
  if (entry.faded === on || entry.win.isDestroyed()) return;
  entry.faded = on;
  entry.win.setOpacity(on ? DRAG_FADE_OPACITY : 1);
};

const over = (id: string, entry: WidgetWindowEntry, point: WidgetWindowPoint | null): void => {
  fade(entry, point !== null);
  const main = getMainWindow();
  if (main && (point || entry.over)) emit(main, 'widget:dragOver', id, point);
  entry.over = point !== null;
};

const drop = (id: string, entry: WidgetWindowEntry, point: WidgetWindowPoint): void => {
  fade(entry, false);
  entry.over = false;
  const main = getMainWindow();
  if (main) emit(main, 'widget:dropIn', id, point);
};

const dragInSignal = { over, drop };

export { dragInSignal };
