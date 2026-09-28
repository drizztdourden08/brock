/* @layer electron-main @kind logic */
import type { RuntimeVersions } from '@drizztdourden08/brock-core/types';

const collectVersions = (): RuntimeVersions => ({
  node: process.versions.node,
  v8: process.versions.v8,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
});

export { collectVersions };
