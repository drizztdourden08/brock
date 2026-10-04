/* @layer renderer-shell @kind logic */
import { normaliseKeywords } from './normalise-keywords';
import { seedEntryId } from './seed-entry-id';
import { seedTarget } from './seed-target';
import type { SearchEntry, SearchEntrySeed } from './search.type';

const liveEntry = (seed: SearchEntrySeed, route: string): SearchEntry => ({
  id: seedEntryId(route, seed),
  kind: 'entry',
  label: seed.label,
  keywords: normaliseKeywords(seed.keywords),
  description: seed.description,
  breadcrumb: [],
  target: seedTarget(route, seed),
});

export { liveEntry };
