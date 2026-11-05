/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { dirOf } from './dir-of';
import type { SpriteManifest, SpriteRemoval } from './sprites.type';

const removeSprites = async (manifest: SpriteManifest, files: FileStore, romFile: string): Promise<SpriteRemoval> => {
  await files.remove(dirOf(manifest, romFile));
  return { success: true };
};

export { removeSprites };
