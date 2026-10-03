/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { widgetAreas } from './widget-areas';
import { widgetRuntime } from './widget-runtime';

const areaFor = (bounds: WidgetWindowBounds): WidgetWindowBounds => {
  const [headless] = widgetRuntime.headless ? widgetAreas() : [];
  return headless ?? screen.getDisplayMatching(bounds).workArea;
};

export { areaFor };
