/* @layer renderer-shell @kind logic */
import type { ShowContext } from '@drizztdourden08/brock-react';
import type { RandomizerPage } from './randomizer-page.type';

const rankOf = (page: RandomizerPage): number => page.order ?? Number.POSITIVE_INFINITY;

const compareRanks = (a: number, b: number): number => {
  if (a === b) return 0;
  return a < b ? -1 : 1;
};

const orderVisiblePages = (pages: readonly RandomizerPage[], ctx: ShowContext): readonly RandomizerPage[] =>
  pages
    .filter((page) => page.when === undefined || page.when(ctx))
    .map((page, index) => ({ page, index }))
    .sort((a, b) => compareRanks(rankOf(a.page), rankOf(b.page)) || a.index - b.index)
    .map(({ page }) => page);

export { orderVisiblePages };
