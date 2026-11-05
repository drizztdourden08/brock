/* @layer renderer-shell @kind hook */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import type { InventoryLayout, InventoryProvider } from '../../../contract/inventory.type';
import { INVENTORY_WIDGET_ID } from '../../../widgets/inventory.widget.constants';

const useInventoryLayout = (inventory: InventoryProvider): readonly [InventoryLayout | undefined, (id: string) => void] => {
  const [id, setId] = useWidgetPref(INVENTORY_WIDGET_ID, 'layout', inventory.layouts[0]?.id ?? '');
  const layout = inventory.layouts.find((candidate) => candidate.id === id) ?? inventory.layouts[0];
  return [layout, setId];
};

export { useInventoryLayout };
