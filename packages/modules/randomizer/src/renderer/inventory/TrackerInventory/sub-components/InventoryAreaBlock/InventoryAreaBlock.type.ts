/* @layer renderer-shell @kind types */
import type { InventoryArea } from '../../../../../contract/inventory.type';

interface InventoryAreaBlockProps {
  area: InventoryArea;
  held: ReadonlySet<string>;
  artOf?(key: string): string | null;
}

export type { InventoryAreaBlockProps };
