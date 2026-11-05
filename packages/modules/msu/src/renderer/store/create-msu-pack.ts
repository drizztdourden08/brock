/* @layer renderer-shell @kind logic */
import { createPack } from '../../edit';
import type { MsuPackMeta } from '../../types';
import type { MsuStoreEnv } from './msu-store.type';

const createMsuPack = ({ game, files }: MsuStoreEnv) => (pack: string, meta?: Partial<MsuPackMeta>) =>
  createPack(game.config, files, pack, meta);

export { createMsuPack };
