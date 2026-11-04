/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packFile } from '../paths';
import type { TrackFileRename } from './edit.type';

const renameTrackFile = async (
  config: MsuGameConfig, files: FileStore, pack: string, rename: TrackFileRename,
): Promise<void> => {
  const src = packFile(config, pack, rename.from);
  const dest = packFile(config, pack, rename.to);
  if (src === dest) return;
  const bytes = await files.readBytes(src);
  if (!bytes) throw new Error(`Track not found: ${rename.from}`);
  await files.writeBytes(dest, bytes);
  await files.remove(src);
};

export { renameTrackFile };
