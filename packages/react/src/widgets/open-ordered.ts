/* @layer renderer-shell @kind logic */
import { openWidget } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { inOrder } from './in-order';
import type { WidgetDef } from './widget.type';

const openOrdered = (layout: WidgetLayout, id: string, definitions: readonly WidgetDef[]): WidgetLayout => {
  const opened = openWidget(layout, id, definitions);
  return opened === layout ? layout : inOrder(opened, id, definitions);
};

export { openOrdered };
