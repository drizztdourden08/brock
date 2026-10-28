/* @layer renderer-shell @kind logic */
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { edgeWidths } from './widget-edge-widths';
import { placeSize } from './widget-place-size';
import type { EdgeWidth, SizedLayout } from './widget-resize-edit.type';
import { widgetSideOf } from './widget-side-of';

const sizeDocked = (layout: WidgetLayout, id: string, size: number, kept: readonly EdgeWidth[]): SizedLayout => {
  const side = widgetSideOf(layout.dock, id);
  const first = placeSize(layout, id, size);
  if (!first) throw new Error(`Widget "${id}" has no resizable edge.`);
  let next = first.layout;
  for (const other of kept) {
    if (other.side === side || other.id === id) continue;
    const now = edgeWidths(next, other.side).find((each) => each.side === other.side);
    if (now && Math.abs(now.px - other.px) > 0.5) next = placeSize(next, other.id, other.px)?.layout ?? next;
  }
  return { layout: next, reason: first.reason };
};

export { sizeDocked };
