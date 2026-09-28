/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { toArrayBuffer } from '../files/to-array-buffer';

const fileHandlers: HandlerGroup = {
  id: 'file',
  register: ({ handle, files }) => {
    handle('file:readBytes', async (_e, path) => {
      const bytes = await files.readBytes(path);
      return bytes ? toArrayBuffer(Buffer.from(bytes)) : null;
    });
    handle('file:readText', (_e, path) => files.readText(path));
    handle('file:writeBytes', (_e, path, data) => files.writeBytes(path, new Uint8Array(data)));
    handle('file:writeText', (_e, path, data) => files.writeText(path, data));
    handle('file:list', (_e, dir) => files.list(dir));
    handle('file:remove', (_e, path) => files.remove(path));
    handle('file:exists', (_e, path) => files.exists(path));
    handle('file:mkdir', (_e, dir) => files.mkdir(dir));
    handle('file:stat', (_e, path) => files.stat(path));
  },
};

export { fileHandlers };
