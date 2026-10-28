/* @layer renderer-shell @kind logic */
import { floatingRect, placementOf, toFloating } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { checkRect } from './widget-check-rect';
import { sizeDocked } from './widget-docked-size';
import { edgeWidths } from './widget-edge-widths';
import { floatArea } from './widget-float-area';
import type { SizedLayout } from './widget-resize-edit.type';
import { widgetSideOf } from './widget-side-of';
import type { WidgetFloatRect } from './widget-snapshot.type';

const resizeDocked = (layout: WidgetLayout, id: string, size: number): SizedLayout => {
  if (!(Number.isFinite(size) && size > 0)) throw new Error('size must be a positive number of pixels.');
  const side = widgetSideOf(layout.dock, id);
  return sizeDocked(layout, id, size, side ? edgeWidths(layout, side) : []);
};

const resizeFloating = (layout: WidgetLayout, id: string, rect: WidgetFloatRect): SizedLayout => {
  checkRect(rect);
  const main = floatArea();
  return {
    layout: {
      ...layout,
      floating: layout.floating.map((entry) => (entry.id === id ? toFloating(id, { ...floatingRect(entry, main), ...rect }, main) : entry)),
    },
    reason: null,
  };
};

const resizeEdit = (layout: WidgetLayout, id: string, to: number | WidgetFloatRect): SizedLayout => {
  const placement = placementOf(layout, id);
  if (placement === null) throw new Error(`Widget "${id}" is not open. Open or dock it first.`);
  if (placement === 'popped') throw new Error(`Widget "${id}" is in its own window. Dock or float it first.`);
  if (placement === 'docked') {
    if (typeof to !== 'number') throw new Error(`Widget "${id}" is docked. Pass a size in pixels, or float it first.`);
    return resizeDocked(layout, id, to);
  }
  if (typeof to === 'number') throw new Error(`Widget "${id}" is floating. Pass a rect with width and height.`);
  return resizeFloating(layout, id, to);
};

export { resizeEdit };
