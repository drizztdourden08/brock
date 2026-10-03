/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { SIZE_TOLERANCE } from './widget-windows.constants';

const near = (a: number, b: number): boolean => Math.abs(a - b) <= SIZE_TOLERANCE;

const shouldIntervene = (proposed: WidgetWindowBounds, wanted: WidgetWindowBounds, snapped: boolean, crossesScale: boolean): boolean => {
  if (crossesScale) return false;
  const sameSize = near(proposed.width, wanted.width) && near(proposed.height, wanted.height);
  const samePlace = near(proposed.x, wanted.x) && near(proposed.y, wanted.y);
  return !(sameSize && samePlace) && (snapped || !sameSize);
};

export { shouldIntervene };
