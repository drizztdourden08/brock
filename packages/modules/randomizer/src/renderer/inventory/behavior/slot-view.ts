/* @layer renderer-shell @kind logic */
import type { InventorySlot } from '../../../contract/inventory.type';
import type { SlotView } from './slot-view.type';

const slotView = (slot: InventorySlot, held: ReadonlySet<string>): SlotView => {
  let level = 0;
  slot.tiers.forEach((tier, index) => {
    if (held.has(tier)) level = index + 1;
  });
  const shown = slot.tiers[Math.max(level - 1, 0)];
  return { level, tiered: slot.tiers.length > 1, artKey: shown ?? slot.id };
};

export { slotView };
