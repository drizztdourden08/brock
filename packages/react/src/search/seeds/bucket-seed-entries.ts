/* @layer renderer-shell @kind logic */
import { entryLabel } from '../../screens/conventions/entry-label';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import type { BucketDef } from '../../screens/conventions/screens-config.type';
import type { SearchEntry, SearchFileSeed, SeedPlace } from '../search.type';
import { bucketEntry } from './bucket-entry';
import { customSeedEntries } from './custom-seed-entries';
import { pageEntry } from './page-entry';
import { pageMetaRows } from './page-meta-rows';
import { seedPlace } from './seed-place';
import { settingsSeedEntries } from './settings-seed-entries';
import { subSeedEntries } from './sub-seed-entries';
import { tabSeedEntries } from './tab-seed-entries';

const pageMetaOf = (seed: SearchFileSeed, seeds: readonly SearchFileSeed[]): SearchFileSeed | undefined =>
  seeds.find((other) => other.kind === 'page-meta' && other.bucket === seed.bucket && other.group === seed.group && other.id === seed.page);

const isPageKind = (kind: SearchFileSeed['kind']): kind is 'page' | 'custom' | 'live' | 'settings' => kind === 'page' || kind === 'custom' || kind === 'live' || kind === 'settings';

const pageSeedEntries = (place: SeedPlace, seed: SearchFileSeed, kind: 'page' | 'custom' | 'live' | 'settings'): SearchEntry[] => {
  const page = pageEntry(place, seed, entryLabel({ id: seed.id, meta: { title: seed.title } }), seed.icon ?? KIND_ICONS[kind]);
  const rows = customSeedEntries(page, seed.entries ?? []);
  return kind === 'settings' ? [page, ...settingsSeedEntries(page, seed.sections ?? []), ...rows] : [page, ...rows];
};

const bucketSeedEntries = (bucket: BucketDef, seed: SearchFileSeed, seeds: readonly SearchFileSeed[] = []): SearchEntry[] => {
  const place = seedPlace(bucket, seed.group);
  if (seed.kind === 'tab') return tabSeedEntries(place, seed, pageMetaOf(seed, seeds));
  if (seed.kind === 'sub') return subSeedEntries(place, seed, seeds);
  if (seed.kind === 'hero') return customSeedEntries(bucketEntry(bucket, seeds), seed.entries ?? []);
  if (seed.kind === 'page-meta') return pageMetaRows(place, seed);
  return isPageKind(seed.kind) ? pageSeedEntries(place, seed, seed.kind) : [];
};

export { bucketSeedEntries };
