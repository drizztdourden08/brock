/* @layer renderer-shell @kind logic */
import { writeTrackFile } from '../../edit';
import type { MsuStoreEnv } from './msu-store.type';

const writeMsuTrackFile = ({ game, files }: MsuStoreEnv) => (pack: string, fileName: string, data: ArrayBuffer) =>
  writeTrackFile(game.config, files, pack, { name: fileName, bytes: new Uint8Array(data) });

export { writeMsuTrackFile };
