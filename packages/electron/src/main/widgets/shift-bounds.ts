/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const shiftBounds = (bounds: WidgetWindowBounds, dx: number, dy: number): WidgetWindowBounds =>
  ({ ...bounds, x: bounds.x + dx, y: bounds.y + dy });

export { shiftBounds };
