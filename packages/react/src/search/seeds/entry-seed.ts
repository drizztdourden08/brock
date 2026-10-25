/* @layer renderer-shell @kind logic */
import type { BucketEntry } from '../../screens/conventions/screen-tree.type';
import type { SearchFileSeed } from '../search.type';
import { entryPlace } from './entry-place';
import { metaSeed } from './meta-seed';

const entrySeed = (entry: BucketEntry): SearchFileSeed[] => {
  if (entry.kind === 'backdrop' || entry.kind === 'settings') return [];
  return [{
    kind: entry.kind,
    id: entry.id,
    bucket: entry.bucket,
    ...entryPlace(entry),
    ...metaSeed(entry.meta),
    ...(entry.kind === 'sub' && entry.meta?.path !== undefined ? { path: entry.meta.path } : {}),
  }];
};

export { entrySeed };
