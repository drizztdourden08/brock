/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { REACH_MIN, TITLE_STRIP } from './widget-windows.constants';

const overlapOf = (aStart: number, aLength: number, bStart: number, bLength: number): number =>
  Math.min(aStart + aLength, bStart + bLength) - Math.max(aStart, bStart);

const stripReaches = (bounds: WidgetWindowBounds, area: WidgetWindowBounds): boolean => {
  const strip = Math.min(TITLE_STRIP, bounds.height);
  const wide = overlapOf(bounds.x, bounds.width, area.x, area.width) >= Math.min(REACH_MIN.width, bounds.width);
  return wide && overlapOf(bounds.y, strip, area.y, area.height) >= Math.min(REACH_MIN.height, strip);
};

const isReachable = (bounds: WidgetWindowBounds, areas: readonly WidgetWindowBounds[]): boolean =>
  areas.some((area) => stripReaches(bounds, area));

export { isReachable };
