/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { installMsulPack } from '../msul';
import type { InstalledPack, InstallProgress } from './install.type';

const installMsul = async (
  config: MsuGameConfig, bytes: Uint8Array, files: FileStore, onProgress: (p: InstallProgress) => void,
): Promise<InstalledPack> => {
  const { pack, ownName } = await installMsulPack(config, files, bytes, {
    onProgress: (done, total) => onProgress({ phase: 'unpack', done, total }),
  });
  return { installedName: pack, ownName };
};

export { installMsul };
