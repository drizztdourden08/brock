/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packFile } from '../paths';

const deleteTrackFile = (config: MsuGameConfig, files: FileStore, pack: string, fileName: string): Promise<void> =>
  files.remove(packFile(config, pack, fileName));

export { deleteTrackFile };
