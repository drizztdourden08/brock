/* @layer renderer-shell @kind logic */
import { entryLabel } from '../../screens/conventions/entry-label';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import type { BucketDef } from '../../screens/conventions/screens-config.type';
import type { SearchEntry, SearchFileSeed } from '../search.type';
import { customSeedEntries } from './custom-seed-entries';
import { pageEntry } from './page-entry';
import { seedPlace } from './seed-place';
import { settingsSeedEntries } from './settings-seed-entries';
import { tabSeedEntries } from './tab-seed-entries';

const bucketSeedEntries = (bucket: BucketDef, seed: SearchFileSeed): SearchEntry[] => {
  const place = seedPlace(bucket, seed.group);
  if (seed.kind === 'tab') return tabSeedEntries(place, seed);
  if (seed.kind !== 'page' && seed.kind !== 'custom' && seed.kind !== 'settings') return [];
  const page = pageEntry(place, seed, entryLabel({ id: seed.id, meta: { title: seed.title } }), seed.icon ?? KIND_ICONS[seed.kind]);
  if (seed.kind === 'settings') return [page, ...settingsSeedEntries(page, seed.sections ?? [])];
  return [page, ...customSeedEntries(page, seed.entries ?? [])];
};

export { bucketSeedEntries };
