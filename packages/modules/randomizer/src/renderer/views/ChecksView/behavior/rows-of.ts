/* @layer renderer-shell @kind logic */
import type { TrackerKind, TrackerProvider } from '../../../../tracker';
import type { CheckRow, RowsInput } from './check-row.type';
import { rowGroupOf } from './row-group-of';

const artFor = (provider: TrackerProvider<unknown>, key: string, item: string | null, kind: TrackerKind): string | null => {
  const art = provider.artOf;
  if (art === undefined) return null;
  return kind === 'event' || item === null ? art(key) : art(item);
};

const rowsOf = (input: RowsInput): CheckRow[] => {
  const { provider, reading, marks } = input;
  const groupOf = rowGroupOf(input);
  const rows: CheckRow[] = [];
  for (const [key, status] of reading.statuses) {
    const region = reading.world.locationsByKey.get(key)?.region ?? '';
    const item = reading.world.placedItems.get(key) ?? null;
    const kind = provider.kindOf?.(key) ?? 'item';
    const { label: group, order } = groupOf({ key, region, status });
    rows.push({
      key,
      label: provider.labelOf?.(key) ?? key,
      item,
      itemLabel: item === null ? null : (provider.itemLabelOf?.(item) ?? item),
      art: artFor(provider, key, item, kind),
      status,
      marked: marks.has(key),
      kind,
      facets: provider.facetsOf?.(key) ?? [],
      badges: provider.badgesOf?.(key, item) ?? [],
      group,
      order,
    });
  }
  return rows;
};

export { rowsOf };
