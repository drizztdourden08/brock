/* @layer renderer-shell @kind logic */
import type { WidgetDef } from '@drizztdourden08/brock-react';

const slottedWidgets = (defs: WidgetDef[], slotOf: () => Pick<WidgetDef, 'context' | 'order'> | undefined): WidgetDef[] =>
  defs.map((def) => ({
    ...def,
    get context() {
      return slotOf()?.context;
    },
    get order() {
      return slotOf()?.order;
    },
  }));

export { slottedWidgets };
