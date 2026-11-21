/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { joinRoute } from '../../navigation/join-route';
import { PARAM_PREFIX } from '../../navigation/navigation.constants';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import { titleCase } from '../../screens/conventions/title-case';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { IndexEntry, SearchFileSeed, SeedPlace } from '../search.type';
import { customSeedEntries } from './custom-seed-entries';

const pageLabelOf = (seed: SearchFileSeed, seeds: readonly SearchFileSeed[]): Text => {
  const own = seeds.find((other) => other.bucket === seed.bucket && other.group === seed.group
    && ((other.kind === 'page-meta' || other.kind === 'page' || other.kind === 'custom') && other.id === seed.page));
  return own?.title ?? titleCase(seed.page ?? '');
};

const subSeedEntries = (place: SeedPlace, seed: SearchFileSeed, seeds: readonly SearchFileSeed[]): IndexEntry[] => {
  const path = seed.path ?? seed.id;
  if (path.includes(PARAM_PREFIX)) return [];
  const route = joinRoute(place.bucket, seed.page ?? '', path);
  const entry: IndexEntry = {
    id: `${SCREEN_ID_PREFIX}${route}`,
    kind: 'page',
    label: seed.title ?? titleCase(seed.id),
    keywords: seed.keywords ?? [],
    breadcrumb: [...place.crumbs, pageLabelOf(seed, seeds)],
    target: { route },
    icon: seed.icon ?? KIND_ICONS.sub,
    devOnly: seed.devOnly,
  };
  return [entry, ...customSeedEntries(entry, seed.entries ?? [])];
};

export { subSeedEntries };
