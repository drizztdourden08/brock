/* @layer renderer-shell @kind logic */
import { readManifest } from '../../edit';
import type { MsuStoreEnv } from './msu-store.type';

const readMsuManifest = ({ game, files }: MsuStoreEnv) => (pack: string) =>
  readManifest(game.config, files, pack);

export { readMsuManifest };
