/* @layer electron-main @kind logic */
import { assertSafeName, packFile } from '../../paths';
import type { PackEnv } from './pack-fs.type';

const packFilePath = (env: PackEnv, pack: string, fileName: string): string => {
  assertSafeName(pack);
  return env.dataPath(packFile(env.game, pack, fileName));
};

export { packFilePath };
