/* @layer electron-main @kind logic */
import type { WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';

const dragWanted = (cursor: WidgetWindowPoint, grab: WidgetWindowPoint, current: WidgetWindowBounds): WidgetWindowBounds =>
  ({ x: cursor.x - grab.x, y: cursor.y - grab.y, width: current.width, height: current.height });

export { dragWanted };
