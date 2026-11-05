/* @layer renderer-shell @kind logic */
import { deleteTrackFile } from '../../edit';
import type { MsuStoreEnv } from './msu-store.type';

const deleteMsuTrackFile = ({ game, files }: MsuStoreEnv) => (pack: string, fileName: string) =>
  deleteTrackFile(game.config, files, pack, fileName);

export { deleteMsuTrackFile };
