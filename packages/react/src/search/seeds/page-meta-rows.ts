/* @layer renderer-shell @kind logic */
import { titleCase } from '../../screens/conventions/title-case';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import type { SearchEntry, SearchFileSeed, SeedPlace } from '../search.type';
import { customSeedEntries } from './custom-seed-entries';
import { pageEntry } from './page-entry';

const pageMetaRows = (place: SeedPlace, seed: SearchFileSeed): SearchEntry[] => {
  const entries = seed.entries ?? [];
  if (entries.length === 0) return [];
  const page = pageEntry(place, seed, seed.title ?? titleCase(seed.id), seed.icon ?? KIND_ICONS.tab);
  return customSeedEntries(page, entries);
};

export { pageMetaRows };
