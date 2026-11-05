/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { dirOf } from './dir-of';
import { expectedOf } from './expected-of';
import type { SpriteManifest } from './sprites.type';

const spritesMissing = async (manifest: SpriteManifest, files: FileStore, romFile: string): Promise<string[]> => {
  const present = new Set(await files.list(dirOf(manifest, romFile)));
  return expectedOf(manifest).filter((name) => !present.has(name));
};

export { spritesMissing };
