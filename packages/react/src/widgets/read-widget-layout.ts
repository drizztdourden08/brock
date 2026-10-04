/* @layer renderer-shell @kind logic */
import { widgetsIn } from '@drizztdourden08/tessera/composites';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { DRAWN_WIDGET_SELECTOR } from './widget.constants';
import { widgetMainRect } from './widget-main-rect';
import type { WidgetLayoutReading } from './widget.type';

const rectOf = (element: Element): NonNullable<WidgetLayoutReading['main']> => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x, y, width, height };
};

const drawnRects = (): WidgetLayoutReading['rects'] => {
  const rects: WidgetLayoutReading['rects'] = {};
  for (const element of document.querySelectorAll<HTMLElement>(DRAWN_WIDGET_SELECTOR)) {
    const id = element.dataset.widgetId;
    const rect = rectOf(element);
    if (id && rect.width > 0 && rect.height > 0) rects[id] = rect;
  }
  return rects;
};

const readWidgetLayout = (): WidgetLayoutReading => {
  const { layout } = useWidgetLayoutStore.getState();
  const main = widgetMainRect.current;
  return {
    layout,
    docked: widgetsIn(layout.dock),
    floating: layout.floating.map((entry) => entry.id),
    popped: layout.popped.map((entry) => entry.id),
    main: main ? { x: main.x, y: main.y, width: main.width, height: main.height } : null,
    rects: drawnRects(),
  };
};

export { readWidgetLayout };
