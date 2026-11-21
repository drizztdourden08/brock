/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { InventoryLayout } from '../../../contract/inventory.type';

interface TrackerInventoryProps {
  layout: InventoryLayout;
  held: ReadonlySet<string>;
  artOf?(key: string): string | null;
  missingArtNotice?: Text;
}

export type { TrackerInventoryProps };
