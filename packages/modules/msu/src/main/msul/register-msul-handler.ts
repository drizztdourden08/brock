/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { toArrayBuffer } from '@drizztdourden08/brock-electron/main';

const registerMsulHandler = ({ handle }: Pick<MainContext, 'handle'>): void => {
  handle('msu:msul:read', async (_event, filePath) => {
    if (!filePath.toLowerCase().endsWith('.msul')) throw new Error('Not a music-pack file');
    return toArrayBuffer(await readFile(filePath));
  });
};

export { registerMsulHandler };
