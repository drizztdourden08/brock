/* @layer renderer-shell @kind logic */
import { groupLabel } from '../../screens/conventions/group-label';
import type { BucketDef } from '../../screens/conventions/screens-config.type';
import type { SeedPlace } from '../search.type';

const seedPlace = (bucket: BucketDef, group: string | undefined): SeedPlace => ({
  bucket: bucket.id,
  crumbs: group === undefined ? [bucket.title] : [bucket.title, groupLabel(bucket, group)],
});

export { seedPlace };
