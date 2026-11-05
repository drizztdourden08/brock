/* @layer renderer-shell @kind logic */
import { readMsu1LoopSample } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const readMsuLoopSample = ({ game, files }: MsuStoreEnv) => (pack: string, fileName: string) =>
  readMsu1LoopSample(game.config, files, pack, fileName);

export { readMsuLoopSample };
