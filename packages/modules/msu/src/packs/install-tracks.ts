/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import type { MsuTrackUpload } from '../edit';
import { packFile } from '../paths';

const installTracks = async (
  config: MsuGameConfig, files: FileStore, pack: string, tracks: MsuTrackUpload[],
): Promise<void> => {
  for (const t of tracks) await files.writeBytes(packFile(config, pack, t.name), t.bytes);
};

export { installTracks };
