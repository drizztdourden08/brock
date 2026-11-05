/* @layer renderer-shell @kind logic */
import { listPackEntries } from '../../inventory';
import type { MsuStoreEnv } from './msu-store.type';

const listMsuPackEntries = ({ game, files }: MsuStoreEnv) => (pack: string) =>
  listPackEntries(game.config, files, pack);

export { listMsuPackEntries };
