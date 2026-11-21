/* @layer renderer-shell @kind logic */
import type { BucketDef } from '../../screens/conventions/screens-config.type';
import { seedKeywords } from '../seed-keywords';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { IndexEntry, SearchFileSeed } from '../search.type';

const bucketEntry = (bucket: BucketDef, seeds: readonly SearchFileSeed[]): IndexEntry => {
  const hero = seeds.find((seed) => seed.kind === 'hero' && seed.bucket === bucket.id);
  return {
    id: `${SCREEN_ID_PREFIX}${bucket.id}`,
    kind: 'screen',
    label: bucket.title,
    keywords: seedKeywords([...(hero?.keywords ?? []), hero?.title]),
    breadcrumb: [],
    target: { route: bucket.id },
    icon: bucket.icon,
  };
};

export { bucketEntry };
