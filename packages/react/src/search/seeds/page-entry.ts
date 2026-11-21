/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { joinRoute } from '../../navigation/join-route';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { IndexEntry, SearchFileSeed, SeedPlace } from '../search.type';

const pageEntry = (place: SeedPlace, seed: Pick<SearchFileSeed, 'id' | 'keywords' | 'devOnly'>, label: Text, icon: string): IndexEntry => {
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
