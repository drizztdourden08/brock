/* @layer renderer-shell @kind logic */
import { renameTrackFile } from '../../edit';
import type { MsuStoreEnv } from './msu-store.type';

const renameMsuTrackFile = ({ game, files }: MsuStoreEnv) => (pack: string, from: string, to: string) =>
  renameTrackFile(game.config, files, pack, { from, to });

export { renameMsuTrackFile };
