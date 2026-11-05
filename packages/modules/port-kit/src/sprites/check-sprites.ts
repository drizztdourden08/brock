/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { readJson } from '@drizztdourden08/brock-core/storage';
import { digestOf } from './digest-of';
import { dirOf } from './dir-of';
import { expectedOf } from './expected-of';
import { RECEIPT_FILE, SPRITE_IMAGE_EXTENSION } from './sprites.constants';
import type { ExtractionReceipt, SpriteCheck, SpriteManifest } from './sprites.type';

const checkSprites = async (manifest: SpriteManifest, files: FileStore, romFile: string): Promise<SpriteCheck> => {
  const dir = dirOf(manifest, romFile);
  const present = new Set((await files.list(dir)).filter((name) => name.endsWith(SPRITE_IMAGE_EXTENSION)));
  if (present.size === 0) return { extracted: false, count: 0 };

  const receipt = await readJson<ExtractionReceipt | null>(files, `${dir}/${RECEIPT_FILE}`, null);
  if (receipt?.manifest === digestOf(manifest)) return { extracted: true, count: present.size };

  return { extracted: expectedOf(manifest).every((name) => present.has(name)), count: present.size };
};

export { checkSprites };
