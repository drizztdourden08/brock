/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { toArrayBufferOrNull } from '@drizztdourden08/brock-electron/main';
import { coreFilePath } from './core-file-path';

const readCore = async (file: string): Promise<ArrayBuffer | null> => {
  try {
    return toArrayBufferOrNull(await readFile(coreFilePath(file)));
  } catch {
    return null;
  }
};

const registerPortKitHandlers = ({ handle }: Pick<MainContext, 'handle'>): void => {
  handle('port-kit:readCore', (_event, file) => readCore(file));
};

export { registerPortKitHandlers };
