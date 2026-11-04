/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packFile } from '../paths';

const readTrackFile = (
  config: MsuGameConfig, files: FileStore, pack: string, fileName: string,
): Promise<Uint8Array | null> => files.readBytes(packFile(config, pack, fileName));

export { readTrackFile };
