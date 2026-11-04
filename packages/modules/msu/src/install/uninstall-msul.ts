/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { deletePack } from '../packs';
import { assertSafeName } from '../paths';

const uninstallMsul = async (config: MsuGameConfig, installedName: string, files: FileStore): Promise<void> => {
  assertSafeName(installedName);
  await deletePack(config, files, installedName);
};

export { uninstallMsul };
