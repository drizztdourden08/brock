/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { offscreenOrigin } from '../window/offscreen-origin';
import { widgetRuntime } from './widget-runtime';

const layoutAreas = (full: boolean): WidgetWindowBounds[] => {
  if (!widgetRuntime.headless) return screen.getAllDisplays().map((display) => (full ? display.bounds : display.workArea));
  const primary = screen.getPrimaryDisplay();
  const { width, height } = full ? primary.bounds : primary.workArea;
  return [{ ...offscreenOrigin(), width, height }];
};

export { layoutAreas };
