/* @layer renderer-shell @kind logic */
import { floatWidget } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { checkRect } from './widget-check-rect';
import { floatArea } from './widget-float-area';
import type { WidgetFloatRect } from './widget-snapshot.type';

const floatEdit = (layout: WidgetLayout, id: string, rect: WidgetFloatRect): WidgetLayout => {
  checkRect(rect);
  const main = floatArea();
  return floatWidget(layout, id, { x: rect.x ?? main.x, y: rect.y ?? main.y, width: rect.width, height: rect.height }, main);
};

export { floatEdit };
