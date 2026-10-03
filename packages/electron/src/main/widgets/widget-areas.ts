/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { offscreenOrigin } from '../window/offscreen-origin';
import { widgetRuntime } from './widget-runtime';
import { HEADLESS_AREA } from './widget-windows.constants';

const widgetAreas = (): WidgetWindowBounds[] =>
  (widgetRuntime.headless ? [{ ...offscreenOrigin(), ...HEADLESS_AREA }] : screen.getAllDisplays().map((display) => display.workArea));

export { widgetAreas };
