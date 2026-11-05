/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { dirOf } from './dir-of';
import { expectedOf } from './expected-of';
import { spritesMissing } from './sprites-missing';
import type { SpriteManifest } from './sprites.type';

const isSpritesStale = async (
  manifest: SpriteManifest, files: FileStore, romFile: string, expectedVersion: string,
): Promise<boolean> => {
  const absent = await spritesMissing(manifest, files, romFile);
  if (absent.length === expectedOf(manifest).length) return false;
  if (absent.length > 0) return true;
  const { stamp } = manifest;
  if (!stamp) return false;
  const text = await files.readText(`${dirOf(manifest, romFile)}/${stamp.file}`);
  return stamp.parse(text) !== expectedVersion;
};

export { isSpritesStale };
