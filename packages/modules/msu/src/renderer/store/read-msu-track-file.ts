/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { readTrackFile } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const readMsuTrackFile = ({ game, files, text }: MsuStoreEnv) => async (pack: string, fileName: string): Promise<ArrayBuffer> => {
  const bytes = await readTrackFile(game.config, files, pack, fileName);
  if (!bytes) throw new Error(text(msg('msu:store.trackNotFound', { name: fileName })));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

export { readMsuTrackFile };
