/* @layer renderer-shell @kind logic */
import { writeManifest } from '../../edit';
import type { MsuPackManifest } from '../../types';
import type { MsuStoreEnv } from './msu-store.type';

const writeMsuManifest = ({ game, files }: MsuStoreEnv) => (pack: string, manifest: MsuPackManifest) =>
  writeManifest(game.config, files, pack, manifest);

export { writeMsuManifest };
