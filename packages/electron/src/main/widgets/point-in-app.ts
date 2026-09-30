/* @layer electron-main @kind logic */
import type { WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';

const within = (point: WidgetWindowPoint, box: WidgetWindowBounds): boolean =>
  point.x >= box.x && point.x < box.x + box.width && point.y >= box.y && point.y < box.y + box.height;

const pointInApp = (cursor: WidgetWindowPoint, dragged: WidgetWindowBounds, content: WidgetWindowBounds): WidgetWindowPoint | null =>
  within(cursor, dragged) && within(cursor, content) ? { x: cursor.x - content.x, y: cursor.y - content.y } : null;

export { pointInApp };
