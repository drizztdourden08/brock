/* @layer renderer-shell @kind logic */
import { readTrackFile } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const readMsuTrackFile = ({ game, files }: MsuStoreEnv) => async (pack: string, fileName: string): Promise<ArrayBuffer> => {
  const bytes = await readTrackFile(game.config, files, pack, fileName);
  if (!bytes) throw new Error(`Track not found: ${fileName}`);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

export { readMsuTrackFile };
