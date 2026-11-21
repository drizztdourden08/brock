/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { BucketDef } from './screens-config.type';
import { titleCase } from './title-case';

const groupLabel = (bucket: BucketDef, id: string | null): Text =>
  id === null ? bucket.title : bucket.groups?.find((group) => group.id === id)?.label ?? titleCase(id);

export { groupLabel };
