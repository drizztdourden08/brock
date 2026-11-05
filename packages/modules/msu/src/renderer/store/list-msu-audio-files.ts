/* @layer renderer-shell @kind logic */
import { listAudioFiles } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const listMsuAudioFiles = ({ game, files }: MsuStoreEnv) => (pack: string) =>
  listAudioFiles(game.config, files, pack);

export { listMsuAudioFiles };
