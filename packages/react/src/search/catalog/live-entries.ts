/* @layer renderer-shell @kind logic */
import type { SearchEntry } from '../search.type';

const placeOf = (entry: SearchEntry, index: readonly SearchEntry[]): SearchEntry | undefined =>
  index.find((candidate) => candidate.target?.anchor === undefined && candidate.target?.route === entry.target?.route);

const liveEntries = (live: readonly SearchEntry[], index: readonly SearchEntry[]): SearchEntry[] =>
  live.map((entry) => {
    const place = entry.breadcrumb.length === 0 ? placeOf(entry, index) : undefined;
    return place ? { ...entry, breadcrumb: [...place.breadcrumb, place.label], icon: entry.icon ?? place.icon } : entry;
  });

export { liveEntries };
