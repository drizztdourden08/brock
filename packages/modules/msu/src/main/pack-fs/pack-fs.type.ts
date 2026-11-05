/* @layer electron-main @kind types */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../../config';

interface PackEnv {
  game: MsuGameConfig;
  files: FileStore;
  dataPath: (relative: string) => string;
}

export type { PackEnv };
