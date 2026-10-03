/* @layer electron-main @kind logic */
import type { WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';

const pointWithin = (point: WidgetWindowPoint, box: WidgetWindowBounds): boolean =>
  point.x >= box.x && point.x < box.x + box.width && point.y >= box.y && point.y < box.y + box.height;

export { pointWithin };
