/* @layer renderer-shell @kind logic */
import { packFileMetadata } from '../../packs';
import type { MsuStoreEnv } from './msu-store.type';

const getMsuFileMetadata = ({ game, files, probe }: MsuStoreEnv) => (pack: string) =>
  packFileMetadata(game.config, files, pack, probe);

export { getMsuFileMetadata };
