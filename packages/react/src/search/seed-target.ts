/* @layer renderer-shell @kind logic */
import type { SearchEntrySeed, SearchTarget } from './search.type';

const seedTarget = (route: string, seed: SearchEntrySeed): SearchTarget => ({
  route,
  ...(seed.anchor === undefined ? {} : { anchor: seed.anchor }),
  ...(seed.params === undefined ? {} : { params: seed.params }),
});

export { seedTarget };
