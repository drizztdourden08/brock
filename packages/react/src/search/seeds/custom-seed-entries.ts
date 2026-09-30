/* @layer renderer-shell @kind logic */
import type { SearchEntry, SearchEntrySeed } from '../search.type';

const customSeedEntries = (page: SearchEntry, seeds: readonly SearchEntrySeed[]): SearchEntry[] => {
  const route = page.target?.route ?? '';
  return seeds.map((seed) => ({
    id: `entry:${route}#${seed.anchor ?? seed.label}`,
    kind: 'entry',
    label: seed.label,
    keywords: seed.keywords ?? [],
    description: seed.description,
    breadcrumb: [...page.breadcrumb, page.label],
    target: seed.anchor === undefined ? { route } : { route, anchor: seed.anchor },
    icon: page.icon,
    devOnly: page.devOnly,
  }));
};

export { customSeedEntries };
