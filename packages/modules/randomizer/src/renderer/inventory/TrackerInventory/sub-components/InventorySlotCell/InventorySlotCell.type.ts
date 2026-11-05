/* @layer renderer-shell @kind types */
import type { InventorySlot } from '../../../../../contract/inventory.type';
import type { SlotView } from '../../../behavior/slot-view.type';

interface InventorySlotCellProps {
  slot: InventorySlot;
  view: SlotView;
  art: string | null;
}

export type { InventorySlotCellProps };
