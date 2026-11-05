/* @layer renderer-shell @kind logic */
import { renamePack } from '../../edit';
import type { MsuStoreEnv } from './msu-store.type';

const renameMsuPack = ({ game, files }: MsuStoreEnv) => (from: string, to: string) =>
  renamePack(game.config, files, from, to);

export { renameMsuPack };
