/* @layer electron-main @kind logic */
import type { WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { pointWithin } from './point-within';

const pointInApp = (cursor: WidgetWindowPoint, dragged: WidgetWindowBounds, content: WidgetWindowBounds): WidgetWindowPoint | null =>
  pointWithin(cursor, dragged) && pointWithin(cursor, content) ? { x: cursor.x - content.x, y: cursor.y - content.y } : null;

export { pointInApp };
