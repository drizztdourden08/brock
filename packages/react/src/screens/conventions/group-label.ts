/* @layer renderer-shell @kind logic */
import type { BucketDef } from './screens-config.type';
import { titleCase } from './title-case';

const groupLabel = (bucket: BucketDef, id: string | null): string =>
  id === null ? bucket.title : bucket.groups?.find((group) => group.id === id)?.label ?? titleCase(id);

export { groupLabel };
