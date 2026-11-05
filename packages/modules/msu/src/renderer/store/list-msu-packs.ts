/* @layer renderer-shell @kind logic */
import { listPacks } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const listMsuPacks = ({ game, files }: MsuStoreEnv) => () =>
  listPacks(game.config, files);

export { listMsuPacks };
