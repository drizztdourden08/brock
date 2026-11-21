/* @layer renderer-shell @kind logic */
import { seedEntryId } from '../seed-entry-id';
import { seedTarget } from '../seed-target';
import type { IndexEntry, SearchEntrySeed } from '../search.type';

const customSeedEntries = (page: IndexEntry, seeds: readonly SearchEntrySeed[]): IndexEntry[] => {
  const route = page.target?.route ?? '';
  return seeds.map((seed) => ({
    id: seedEntryId(route, seed),
    kind: 'entry',
    label: seed.label,
    keywords: seed.keywords ?? [],
    description: seed.description,
    breadcrumb: [...page.breadcrumb, page.label],
    target: seedTarget(route, seed),
    icon: page.icon,
    devOnly: page.devOnly,
  }));
};

export { customSeedEntries };
