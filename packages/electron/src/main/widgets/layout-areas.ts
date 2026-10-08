/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { offscreenOrigin } from '../window/offscreen-origin';
import { widgetRuntime } from './widget-runtime';

const layoutAreas = (full: boolean): WidgetWindowBounds[] => {
  const { headless, pinnedArea } = widgetRuntime;
  if (!headless && !pinnedArea) return screen.getAllDisplays().map((display) => (full ? display.bounds : display.workArea));
  const primary = screen.getPrimaryDisplay();
  const shown = full ? primary.bounds : primary.workArea;
  const { width, height } = pinnedArea ?? shown;
  return [{ ...(headless ? offscreenOrigin() : { x: shown.x, y: shown.y }), width, height }];
};

export { layoutAreas };
