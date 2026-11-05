/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { writeJson } from '@drizztdourden08/brock-core/storage';
import { digestOf } from './digest-of';
import { dirOf } from './dir-of';
import { RECEIPT_FILE } from './sprites.constants';
import type { ExtractionReceipt, SpriteBuffer, SpriteManifest } from './sprites.type';

const writeSprites = async (
  manifest: SpriteManifest, files: FileStore, romFile: string, buffers: SpriteBuffer[],
): Promise<void> => {
  const dir = dirOf(manifest, romFile);
  await files.remove(dir);
  for (const buf of buffers) await files.writeBytes(`${dir}/${buf.name}`, buf.bytes);
  const receipt: ExtractionReceipt = { manifest: digestOf(manifest), count: buffers.length };
  await writeJson(files, `${dir}/${RECEIPT_FILE}`, receipt);
};

export { writeSprites };
