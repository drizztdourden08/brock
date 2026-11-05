/* @layer renderer-shell @kind types */
interface InventorySlot {
  id: string;
  label: string;
  tiers: readonly string[];
}

interface InventoryArea {
  id: string;
  label?: string;
  rows: readonly (readonly InventorySlot[])[];
}

interface InventoryLayout {
  id: string;
  label: string;
  areas: readonly InventoryArea[];
}

interface InventoryWidgetSlot {
  context?: string;
  order?: number;
}

interface InventoryProvider {
  layouts: readonly InventoryLayout[];
  widget?: InventoryWidgetSlot;
}

export type { InventoryArea, InventoryLayout, InventoryProvider, InventorySlot, InventoryWidgetSlot };
