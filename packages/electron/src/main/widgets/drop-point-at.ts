/* @layer electron-main @kind logic */
import type { WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { coveredAt } from './covered-at';
import { pointInApp } from './point-in-app';

const dropPointAt = (id: string, cursor: WidgetWindowPoint, dragged: WidgetWindowBounds): WidgetWindowPoint | null => {
  const main = getMainWindow();
  if (!main || main.isDestroyed() || main.isMinimized() || !main.isVisible()) return null;
  const point = pointInApp(cursor, dragged, main.getContentBounds());
  return point && !coveredAt(main, cursor, id) ? point : null;
};

export { dropPointAt };
