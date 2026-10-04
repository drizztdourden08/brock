/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from '../navigation/navigation.constants';
import { rankEntries } from './rank-entries';
import type { RankedInScope, SearchEntry } from './search.type';

const inBucket = (entry: SearchEntry, bucket: string): boolean => entry.target?.route.split(ROUTE_SEPARATOR)[0] === bucket;

const rankInScope = (entries: readonly SearchEntry[], query: string, bucket: string | null): RankedInScope => {
  const ranked = rankEntries(entries, query);
  if (bucket === null) return { inScope: [], rest: ranked };
  return { inScope: ranked.filter((entry) => inBucket(entry, bucket)), rest: ranked.filter((entry) => !inBucket(entry, bucket)) };
};

export { rankInScope };
