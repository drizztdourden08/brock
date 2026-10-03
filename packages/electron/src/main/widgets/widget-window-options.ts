/* @layer electron-main @kind logic */
import type { BrowserWindowConstructorOptions } from 'electron';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { placeWidgetWindow } from './place-widget-window';
import { WIDGET_WINDOW_MIN } from './widget-windows.constants';
import type { WidgetWindowSetup } from './widget-windows.type';

const widgetWindowOptions = (setup: WidgetWindowSetup, id: string, popped?: WidgetWindowOpen): BrowserWindowConstructorOptions => ({
  ...setup.base,
  ...placeWidgetWindow(popped),
  minWidth: WIDGET_WINDOW_MIN.width,
  minHeight: WIDGET_WINDOW_MIN.height,
  frame: false,
  autoHideMenuBar: true,
  skipTaskbar: popped?.taskbar !== true,
  title: `${setup.title} - ${id}`,
  show: false,
  focusable: !setup.headless,
});

export { widgetWindowOptions };
