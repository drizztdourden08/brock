/* @layer renderer-shell @kind logic */
import type { CheckRow, RowsInput } from './check-row.type';
import { rowGroupOf } from './row-group-of';

const rowsOf = (input: RowsInput): CheckRow[] => {
  const { provider, reading, marks, showItems } = input;
  const groupOf = rowGroupOf(input);
  const rows: CheckRow[] = [];
  for (const [key, status] of reading.statuses) {
    const region = reading.world.locationsByKey.get(key)?.region ?? '';
    const placed = reading.world.placedItems.get(key);
    const { label: group, order } = groupOf({ key, region, status });
    rows.push({
      key,
      label: provider.labelOf?.(key) ?? key,
      item: showItems && placed !== undefined ? (provider.itemLabelOf?.(placed) ?? placed) : null,
      status,
      marked: marks.has(key),
      group,
      order,
    });
  }
  return rows;
};

export { rowsOf };
