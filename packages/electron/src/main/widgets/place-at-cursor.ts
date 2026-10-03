/* @layer electron-main @kind logic */
import type { WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { CURSOR_GRAB } from './widget-windows.constants';

const placeAtCursor = (cursor: WidgetWindowPoint, size: { width: number; height: number }): WidgetWindowBounds => ({
  x: cursor.x - Math.min(CURSOR_GRAB.x, Math.floor(size.width / 2)),
  y: cursor.y - CURSOR_GRAB.y,
  width: size.width,
  height: size.height,
});

export { placeAtCursor };
