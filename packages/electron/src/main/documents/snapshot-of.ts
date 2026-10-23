/* @layer electron-main @kind logic */
import type { SnapshotMeta, SnapshotWrite } from '@drizztdourden08/brock-core/platform';
import { bytesOf } from './bytes-of';
import type { SnapshotArgs } from './snapshot-of.type';

const snapshotOf = (value: SnapshotWrite | undefined): SnapshotArgs => {
  const meta: SnapshotMeta = {
    ...(typeof value?.name === 'string' ? { name: value.name } : {}),
    ...(typeof value?.path === 'string' ? { path: value.path } : {}),
  };
  return { key: typeof value?.key === 'string' ? value.key : '', data: bytesOf(value?.data, 'A recovery snapshot'), meta };
};

export { snapshotOf };
