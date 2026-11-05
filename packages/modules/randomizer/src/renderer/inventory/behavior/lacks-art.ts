/* @layer renderer-shell @kind logic */
import type { InventoryLayout } from '../../../contract/inventory.type';
import { slotView } from './slot-view';

const lacksArt = (layout: InventoryLayout, held: ReadonlySet<string>, artOf: (key: string) => string | null): boolean =>
  layout.areas.every((area) => area.rows.every((row) => row.every((slot) => artOf(slotView(slot, held).artKey) === null)));

export { lacksArt };
