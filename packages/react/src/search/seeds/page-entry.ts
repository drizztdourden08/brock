/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../navigation/join-route';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { SearchEntry, SearchFileSeed, SeedPlace } from '../search.type';

const pageEntry = (place: SeedPlace, seed: Pick<SearchFileSeed, 'id' | 'keywords' | 'devOnly'>, label: string, icon: string): SearchEntry => {
  const route = joinRoute(place.bucket, seed.id);
  return {
    id: `${SCREEN_ID_PREFIX}${route}`,
    kind: 'page',
    label,
    keywords: seed.keywords ?? [],
    breadcrumb: place.crumbs,
    target: { route },
    icon,
    devOnly: seed.devOnly,
  };
};

export { pageEntry };
