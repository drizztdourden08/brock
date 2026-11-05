/* @layer renderer-shell @kind logic */
import type { WidgetDef } from '@drizztdourden08/brock-react';
import type { WidgetSlot } from '../../../contract/widget-slot.type';

const slottedWidgets = (defs: WidgetDef[], slotOf: () => WidgetSlot | undefined): WidgetDef[] =>
  defs.map((def) => ({
    ...def,
    get context() {
      return slotOf()?.context;
    },
    get order() {
      return slotOf()?.order;
    },
    get padding() {
      return slotOf()?.padding ?? def.padding;
    },
    get icon() {
      return slotOf()?.icon ?? def.icon;
    },
    get popOut() {
      return slotOf()?.popOut ?? def.popOut;
    },
  }));

export { slottedWidgets };
