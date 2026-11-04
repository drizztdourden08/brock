/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packDir } from '../paths';

const deletePack = (
  config: MsuGameConfig, files: FileStore & { trash?: (path: string) => Promise<void> }, pack: string,
): Promise<void> => (files.trash ? files.trash(packDir(config, pack)) : files.remove(packDir(config, pack)));

export { deletePack };
