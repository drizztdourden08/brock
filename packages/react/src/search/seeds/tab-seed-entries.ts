/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../navigation/join-route';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import { titleCase } from '../../screens/conventions/title-case';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { SearchEntry, SearchFileSeed, SeedPlace } from '../search.type';
import { pageEntry } from './page-entry';

const tabPageEntry = (place: SeedPlace, folder: string, pageSeed: Partial<SearchFileSeed>): SearchEntry =>
  pageEntry(place, { id: folder, keywords: pageSeed.keywords, devOnly: pageSeed.devOnly }, pageSeed.title ?? titleCase(folder), pageSeed.icon ?? KIND_ICONS.tab);

const tabSeedEntries = (place: SeedPlace, seed: SearchFileSeed, pageSeed: Partial<SearchFileSeed> = {}): SearchEntry[] => {
  const folder = seed.page ?? seed.id;
  const page = tabPageEntry(place, folder, pageSeed);
  const route = joinRoute(place.bucket, folder, seed.id);
  const tab: SearchEntry = {
    id: `${SCREEN_ID_PREFIX}${route}`,
    kind: 'tab',
    label: seed.title ?? titleCase(seed.id),
    keywords: seed.keywords ?? [],
    breadcrumb: [...place.crumbs, page.label],
    target: { route },
    icon: seed.icon ?? KIND_ICONS.tab,
    devOnly: seed.devOnly ?? page.devOnly,
  };
  return [page, tab];
};

export { tabSeedEntries };
