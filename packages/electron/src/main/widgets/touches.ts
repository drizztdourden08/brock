/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { spansOverlap } from './spans-overlap';
import { FLUSH_TOLERANCE } from './widget-windows.constants';

const near = (a: number, b: number): boolean => Math.abs(a - b) <= FLUSH_TOLERANCE;

const besideX = (a: WidgetWindowBounds, b: WidgetWindowBounds): boolean => near(a.x + a.width, b.x) || near(b.x + b.width, a.x);

const besideY = (a: WidgetWindowBounds, b: WidgetWindowBounds): boolean => near(a.y + a.height, b.y) || near(b.y + b.height, a.y);

const touches = (a: WidgetWindowBounds, b: WidgetWindowBounds): boolean => {
  const sideBySide = besideX(a, b);
  const stacked = besideY(a, b);
  if (sideBySide && stacked) return true;
  if (sideBySide) return spansOverlap(a.y, a.height, b.y, b.height);
  return stacked && spansOverlap(a.x, a.width, b.x, b.width);
};

export { touches };
