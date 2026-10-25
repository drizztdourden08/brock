/* @layer renderer-shell @kind logic */
import type { BucketEntry } from '../../screens/conventions/screen-tree.type';
import { normaliseKeywords } from '../normalise-keywords';
import type { SearchFileSeed } from '../search.type';

const entrySeed = (entry: BucketEntry): SearchFileSeed[] => {
  if (entry.kind === 'backdrop' || entry.kind === 'settings') return [];
  const { meta } = entry;
  return [{
    kind: entry.kind,
    id: entry.id,
    bucket: entry.bucket,
    ...('group' in entry && entry.group !== undefined ? { group: entry.group } : {}),
    ...('page' in entry ? { page: entry.page } : {}),
    ...(meta?.title === undefined ? {} : { title: meta.title }),
    ...(meta?.icon === undefined ? {} : { icon: meta.icon }),
    ...(entry.kind === 'sub' && meta?.path !== undefined ? { path: meta.path } : {}),
    keywords: normaliseKeywords(meta?.keywords),
    ...(meta?.devOnly === true ? { devOnly: true } : {}),
  }];
};

export { entrySeed };
