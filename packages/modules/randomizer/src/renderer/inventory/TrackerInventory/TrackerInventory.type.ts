/* @layer renderer-shell @kind types */
import type { InventoryLayout } from '../../../contract/inventory.type';

interface TrackerInventoryProps {
  layout: InventoryLayout;
  held: ReadonlySet<string>;
  artOf?(key: string): string | null;
}

export type { TrackerInventoryProps };
