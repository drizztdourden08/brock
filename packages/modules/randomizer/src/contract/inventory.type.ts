/* @layer renderer-shell @kind types */
import type { WidgetSlot } from './widget-slot.type';

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

type InventoryWidgetSlot = WidgetSlot;

interface InventoryProvider {
  layouts: readonly InventoryLayout[];
  widget?: InventoryWidgetSlot;
  missingArtNotice?: string;
}

export type { InventoryArea, InventoryLayout, InventoryProvider, InventorySlot, InventoryWidgetSlot };
