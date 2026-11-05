/* @layer renderer-shell @kind logic */
import { widgetsFromFiles } from '@drizztdourden08/brock-react';
import type { WidgetDef } from '@drizztdourden08/brock-react';
import { INVENTORY_WIDGET_ID } from '../../widgets/inventory.widget.constants';
import InventoryWidget, { meta } from '../../widgets/inventory.widget';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';

const slotOf = () => useRandomizerGameStore.getState().game?.inventory?.widget;

const inventoryWidgets: WidgetDef[] = widgetsFromFiles([{ id: INVENTORY_WIDGET_ID, component: InventoryWidget, meta }]).map((def) => ({
  ...def,
  get context() {
    return slotOf()?.context;
  },
  get order() {
    return slotOf()?.order;
  },
}));

export { inventoryWidgets };
