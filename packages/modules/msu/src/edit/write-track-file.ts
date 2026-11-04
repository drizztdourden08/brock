/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packFile } from '../paths';
import type { MsuTrackUpload } from './edit.type';

const writeTrackFile = (
  config: MsuGameConfig, files: FileStore, pack: string, upload: MsuTrackUpload,
): Promise<void> => files.writeBytes(packFile(config, pack, upload.name), upload.bytes);

export { writeTrackFile };
