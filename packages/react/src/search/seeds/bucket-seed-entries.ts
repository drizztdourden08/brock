/* @layer renderer-shell @kind logic */
import { entryLabel } from '../../screens/conventions/entry-label';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import type { BucketDef } from '../../screens/conventions/screens-config.type';
import type { SearchEntry, SearchFileSeed, SeedPlace } from '../search.type';
import { customSeedEntries } from './custom-seed-entries';
import { pageEntry } from './page-entry';
import { seedPlace } from './seed-place';
import { settingsSeedEntries } from './settings-seed-entries';
import { subSeedEntries } from './sub-seed-entries';
import { tabSeedEntries } from './tab-seed-entries';

const pageMetaOf = (seed: SearchFileSeed, seeds: readonly SearchFileSeed[]): SearchFileSeed | undefined =>
  seeds.find((other) => other.kind === 'page-meta' && other.bucket === seed.bucket && other.group === seed.group && other.id === seed.page);

const pageSeedEntries = (place: SeedPlace, seed: SearchFileSeed, kind: 'page' | 'custom' | 'settings'): SearchEntry[] => {
  const page = pageEntry(place, seed, entryLabel({ id: seed.id, meta: { title: seed.title } }), seed.icon ?? KIND_ICONS[kind]);
  if (kind === 'settings') return [page, ...settingsSeedEntries(page, seed.sections ?? [])];
  return [page, ...customSeedEntries(page, seed.entries ?? [])];
};

const bucketSeedEntries = (bucket: BucketDef, seed: SearchFileSeed, seeds: readonly SearchFileSeed[] = []): SearchEntry[] => {
  const place = seedPlace(bucket, seed.group);
  if (seed.kind === 'tab') return tabSeedEntries(place, seed, pageMetaOf(seed, seeds));
  if (seed.kind === 'sub') return subSeedEntries(place, seed, seeds);
  return seed.kind === 'page' || seed.kind === 'custom' || seed.kind === 'settings' ? pageSeedEntries(place, seed, seed.kind) : [];
};

export { bucketSeedEntries };
