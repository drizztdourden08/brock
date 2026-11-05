/* @layer renderer-shell @kind logic */
import type { TrackerKind, TrackerProvider } from '../../../../tracker';
import type { CheckRow, RowsInput } from './check-row.type';
import { rowGroupOf } from './row-group-of';

const artFor = (provider: TrackerProvider<unknown>, key: string, item: string | null, kind: TrackerKind): string | null => {
  const art = provider.artOf;
  if (art === undefined) return null;
  return kind === 'event' || item === null ? art(key) : art(item);
};

const itemLabelFor = (provider: TrackerProvider<unknown>, item: string | null): string | null =>
  item === null ? null : (provider.itemLabelOf?.(item) ?? item);

const describedFor = (provider: TrackerProvider<unknown>, key: string, item: string | null) => {
  const kind = provider.kindOf?.(key) ?? 'item';
  return {
    label: provider.labelOf?.(key) ?? key,
    itemLabel: itemLabelFor(provider, item),
    art: artFor(provider, key, item, kind),
    kind,
    facets: provider.facetsOf?.(key) ?? [],
    badges: provider.badgesOf?.(key, item) ?? [],
  };
};

const rowsOf = (input: RowsInput): CheckRow[] => {
  const { provider, reading, marks } = input;
  const groupOf = rowGroupOf(input);
  return [...reading.statuses].map(([key, status]) => {
    const region = reading.world.locationsByKey.get(key)?.region ?? '';
    const item = reading.world.placedItems.get(key) ?? null;
    const { label: group, order } = groupOf({ key, region, status });
    return { key, item, status, marked: marks.has(key), group, order, ...describedFor(provider, key, item) };
  });
};

export { rowsOf };
