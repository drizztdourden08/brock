/* @layer renderer-shell @kind logic */
import { seedKeywords } from './normalise-keywords';
import { seedEntryId } from './seed-entry-id';
import { seedTarget } from './seed-target';
import type { IndexEntry, SearchEntrySeed } from './search.type';

const liveEntry = (seed: SearchEntrySeed, route: string): IndexEntry => ({
  id: seedEntryId(route, seed),
  kind: 'entry',
  label: seed.label,
  keywords: seedKeywords(seed.keywords),
  description: seed.description,
  breadcrumb: [],
  target: seedTarget(route, seed),
});

export { liveEntry };
