/* @layer renderer-shell @kind logic */
import type { BucketDef } from '../../screens/conventions/screens-config.type';
import { normaliseKeywords } from '../normalise-keywords';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { SearchEntry, SearchFileSeed } from '../search.type';

const bucketEntry = (bucket: BucketDef, seeds: readonly SearchFileSeed[]): SearchEntry => {
  const hero = seeds.find((seed) => seed.kind === 'hero' && seed.bucket === bucket.id);
  return {
    id: `${SCREEN_ID_PREFIX}${bucket.id}`,
    kind: 'screen',
    label: bucket.title,
    keywords: normaliseKeywords([...(hero?.keywords ?? []), hero?.title ?? '']),
    breadcrumb: [],
    target: { route: bucket.id },
    icon: bucket.icon,
  };
};

export { bucketEntry };
