/* @layer renderer-shell @kind logic */
import type { CatalogInput, IndexEntry, SearchEntry } from '../search.type';
import { fallbackText } from '../../i18n/fallback-text';
import { resolveEntry } from './resolve-entry';

const placeOf = (entry: IndexEntry, index: readonly IndexEntry[]): IndexEntry | undefined =>
  index.find((candidate) => candidate.target?.anchor === undefined && candidate.target?.route === entry.target?.route);

const liveEntries = (input: CatalogInput): SearchEntry[] => {
  const text = input.text ?? fallbackText;
  return input.live.map((entry) => {
    const place = entry.breadcrumb.length === 0 ? placeOf(entry, input.index) : undefined;
    const placed = place ? { ...entry, breadcrumb: [...place.breadcrumb, place.label], icon: entry.icon ?? place.icon } : entry;
    return resolveEntry(placed, text);
  });
};

export { liveEntries };
