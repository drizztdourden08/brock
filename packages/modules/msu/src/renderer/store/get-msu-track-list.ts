/* @layer renderer-shell @kind logic */
import { getTrackList } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const getMsuTrackList = ({ game, files }: MsuStoreEnv) => (pack: string) =>
  getTrackList(game.config, files, pack);

export { getMsuTrackList };
