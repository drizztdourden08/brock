/* @layer renderer-shell @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const sameRect = (a: WidgetWindowBounds | null | undefined, b: WidgetWindowBounds | null | undefined): boolean => {
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
};

export { sameRect };
