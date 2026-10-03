/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const sameBounds = (a: WidgetWindowBounds, b: WidgetWindowBounds): boolean =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

export { sameBounds };
