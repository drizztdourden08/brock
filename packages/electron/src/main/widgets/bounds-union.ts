/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const boundsUnion = (all: readonly WidgetWindowBounds[]): WidgetWindowBounds | null => {
  if (all.length === 0) return null;
  const left = Math.min(...all.map((b) => b.x));
  const top = Math.min(...all.map((b) => b.y));
  const right = Math.max(...all.map((b) => b.x + b.width));
  const bottom = Math.max(...all.map((b) => b.y + b.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { boundsUnion };
