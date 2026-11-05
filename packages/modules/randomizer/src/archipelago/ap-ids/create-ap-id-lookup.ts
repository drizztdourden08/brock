/* @layer core @kind logic */
import { lookupOrThrow } from './lookup-or-throw';
import type { ApIdLookup } from './ap-ids.type';

const reversed = <K extends string>(table: ReadonlyMap<K, number>): ReadonlyMap<number, K> =>
  new Map([...table].map(([key, id]) => [id, key]));

const createApIdLookup = <L extends string, I extends string>(
  locations: Readonly<Record<L, number>>, items: Readonly<Record<I, number>>,
): ApIdLookup<L, I> => {
  const locationIds: ReadonlyMap<L, number> = new Map(Object.entries(locations) as [L, number][]);
  const itemIds: ReadonlyMap<I, number> = new Map(Object.entries(items) as [I, number][]);
  const locationKeys = reversed(locationIds);
  const itemKeys = reversed(itemIds);
  return {
    locationIdOf: (key) => lookupOrThrow(locationIds, key, 'location id for'),
    itemIdOf: (key) => lookupOrThrow(itemIds, key, 'item id for'),
    locationKeyOf: (id) => locationKeys.get(id),
    itemKeyOf: (id) => itemKeys.get(id),
  };
};

export { createApIdLookup };
