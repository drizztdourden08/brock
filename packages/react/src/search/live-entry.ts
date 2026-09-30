/* @layer renderer-shell @kind logic */
import { normaliseKeywords } from './normalise-keywords';
import type { SearchEntry, SearchEntrySeed } from './search.type';

const liveEntry = (seed: SearchEntrySeed, route: string): SearchEntry => ({
  id: `entry:${route}#${seed.anchor ?? seed.label}`,
  kind: 'entry',
  label: seed.label,
  keywords: normaliseKeywords(seed.keywords),
  description: seed.description,
  breadcrumb: [],
  target: seed.anchor === undefined ? { route } : { route, anchor: seed.anchor },
});

export { liveEntry };
