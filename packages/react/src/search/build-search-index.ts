/* @layer renderer-shell @kind logic */
import { uniqueById } from '../collections/unique-by-id';
import type { ScreensConfig } from '../screens/conventions/screens-config.type';
import type { SearchEntry, SearchFileSeed } from './search.type';
import { bucketEntry } from './seeds/bucket-entry';
import { bucketSeedEntries } from './seeds/bucket-seed-entries';
import { screenSeedEntry } from './seeds/screen-seed-entry';

const seedEntries = (config: ScreensConfig, seed: SearchFileSeed, seeds: readonly SearchFileSeed[]): SearchEntry[] => {
  if (seed.kind === 'card' || seed.kind === 'layer') return [screenSeedEntry(seed, seed.kind)];
  const bucket = config.buckets.find((candidate) => candidate.id === seed.bucket);
  return bucket === undefined ? [] : bucketSeedEntries(bucket, seed, seeds);
};

const buildSearchIndex = (config: ScreensConfig, seeds: readonly SearchFileSeed[]): SearchEntry[] => uniqueById([
  ...config.buckets.map((bucket) => bucketEntry(bucket, seeds)),
  ...seeds.flatMap((seed) => seedEntries(config, seed, seeds)),
]);

export { buildSearchIndex };
