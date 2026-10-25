/* @layer renderer-shell @kind logic */
import { uniqueById } from '../../collections/unique-by-id';
import type { ModuleBucket } from '../../modules/renderer-module.type';
import { buildSearchIndex } from '../../search/build-search-index';
import { entrySeed } from '../../search/seeds/entry-seed';
import type { SearchEntry } from '../../search/search.type';
import { bucketHub } from './bucket-hub';
import type { ScreenTree } from './screen-tree.type';

const problemsOf = (tree: ScreenTree, buckets: readonly ModuleBucket[]): string[] => {
  const taken = new Set([...tree.config.buckets.map((bucket) => bucket.id), ...tree.screens.map((screen) => screen.id), ...(tree.base ? [tree.base.id] : [])]);
  return buckets.flatMap(({ bucket, entries }) => {
    const known = taken.has(bucket.id);
    taken.add(bucket.id);
    return [
      ...(known ? [`the module bucket "${bucket.id}" has the id of a bucket or screen that is already declared`] : []),
      ...entries.filter((entry) => entry.bucket !== bucket.id).map((entry) => `the entry "${entry.id}" of the module bucket "${bucket.id}" names the bucket "${entry.bucket}"`),
    ];
  });
};

const searchOf = ({ bucket, entries }: ModuleBucket): SearchEntry[] =>
  buildSearchIndex({ buckets: [bucket], home: bucket.id }, entries.flatMap(entrySeed));

const withModuleBuckets = (tree: ScreenTree, buckets: readonly ModuleBucket[]): ScreenTree => {
  if (buckets.length === 0) return tree;
  const problems = problemsOf(tree, buckets);
  if (problems.length > 0) throw new Error(`modules: ${problems.join('; ')}.`);
  return {
    ...tree,
    config: { ...tree.config, buckets: [...tree.config.buckets, ...buckets.map(({ bucket }) => bucket)] },
    hubs: [...tree.hubs, ...buckets.map(({ bucket, entries }) => bucketHub(bucket, entries))],
    search: uniqueById([...tree.search, ...buckets.flatMap(searchOf)]),
  };
};

export { withModuleBuckets };
