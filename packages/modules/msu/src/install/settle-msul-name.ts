/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { renamePack } from '../edit';
import { packDir } from '../paths';

const settleMsulName = async (
  config: MsuGameConfig, installedName: string, ownName: string, files: FileStore,
): Promise<string> => {
  if (ownName === installedName || await files.exists(packDir(config, ownName))) return installedName;
  await renamePack(config, files, installedName, ownName);
  return ownName;
};

export { settleMsulName };
