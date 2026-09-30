/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const clampToArea = (wanted: WidgetWindowBounds, area: WidgetWindowBounds): WidgetWindowBounds => {
  const width = Math.min(wanted.width, area.width);
  const height = Math.min(wanted.height, area.height);
  const x = Math.min(Math.max(wanted.x, area.x), area.x + area.width - width);
  const y = Math.min(Math.max(wanted.y, area.y), area.y + area.height - height);
  return { x, y, width, height };
};

export { clampToArea };
