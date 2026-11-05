/* @layer core @kind logic */
import type { ApIdLookup } from '../ap-ids/ap-ids.type';
import type { IdAdapters } from './id-adapters.type';

const idAdaptersOf = <L extends string, I extends string>(lookup: ApIdLookup<L, I>): IdAdapters => ({
  locationIdOf: (key) => {
    try {
      return lookup.locationIdOf(key as L);
    } catch {
      return null;
    }
  },
  locationKeyOf: (id) => lookup.locationKeyOf(id) ?? null,
});

export { idAdaptersOf };
