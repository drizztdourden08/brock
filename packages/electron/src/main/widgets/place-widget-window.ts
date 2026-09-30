/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { clampToArea } from './clamp-to-area';
import { WIDGET_WINDOW_OFFSET, WIDGET_WINDOW_SIZE } from './widget-windows.constants';

const besideApp = (): WidgetWindowBounds => {
  const main = getMainWindow();
  const anchor = main && !main.isDestroyed() ? main.getBounds() : screen.getPrimaryDisplay().workArea;
  return { x: anchor.x + WIDGET_WINDOW_OFFSET, y: anchor.y + WIDGET_WINDOW_OFFSET, ...WIDGET_WINDOW_SIZE };
};

const placeWidgetWindow = (remembered?: WidgetWindowBounds): WidgetWindowBounds => {
  const wanted = remembered ?? besideApp();
  return clampToArea(wanted, screen.getDisplayMatching(wanted).workArea);
};

export { placeWidgetWindow };
