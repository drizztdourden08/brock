/* @layer electron-main @kind logic */
import type { BrowserWindowConstructorOptions } from 'electron';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { offscreenOrigin } from '../window/offscreen-origin';
import { placeWidgetWindow } from './place-widget-window';
import { WIDGET_WINDOW_MIN, WIDGET_WINDOW_SIZE } from './widget-windows.constants';
import type { WidgetWindowSetup } from './widget-windows.type';

const widgetWindowOptions = (setup: WidgetWindowSetup, id: string, popped?: WidgetWindowOpen): BrowserWindowConstructorOptions => ({
  ...setup.base,
  ...(setup.headless ? { ...offscreenOrigin(), ...WIDGET_WINDOW_SIZE } : placeWidgetWindow(popped?.bounds)),
  minWidth: WIDGET_WINDOW_MIN.width,
  minHeight: WIDGET_WINDOW_MIN.height,
  frame: false,
  autoHideMenuBar: true,
  title: `${setup.title} - ${id}`,
  show: false,
  focusable: !setup.headless,
});

export { widgetWindowOptions };
