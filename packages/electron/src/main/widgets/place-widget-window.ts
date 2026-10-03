/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds, WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { areaFor } from './area-for';
import { clampToArea } from './clamp-to-area';
import { placeAtCursor } from './place-at-cursor';
import { WIDGET_WINDOW_OFFSET, WIDGET_WINDOW_SIZE } from './widget-windows.constants';

const besideApp = (): WidgetWindowBounds => {
  const main = getMainWindow();
  const anchor = main && !main.isDestroyed() ? main.getBounds() : screen.getPrimaryDisplay().workArea;
  return { x: anchor.x + WIDGET_WINDOW_OFFSET, y: anchor.y + WIDGET_WINDOW_OFFSET, ...WIDGET_WINDOW_SIZE };
};

const wantedPlace = (popped?: WidgetWindowOpen): WidgetWindowBounds => {
  if (!popped?.atCursor) return popped?.bounds ?? besideApp();
  const size = popped.bounds ? { width: popped.bounds.width, height: popped.bounds.height } : WIDGET_WINDOW_SIZE;
  return placeAtCursor(screen.getCursorScreenPoint(), size);
};

const placeWidgetWindow = (popped?: WidgetWindowOpen): WidgetWindowBounds => {
  const wanted = wantedPlace(popped);
  return clampToArea(wanted, areaFor(wanted));
};

export { placeWidgetWindow };
