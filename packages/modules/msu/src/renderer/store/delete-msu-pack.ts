/* @layer renderer-shell @kind logic */
import { deletePack } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const deleteMsuPack = ({ game, files }: MsuStoreEnv) => (pack: string) =>
  deletePack(game.config, files, pack);

export { deleteMsuPack };
