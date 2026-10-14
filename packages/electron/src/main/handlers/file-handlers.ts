/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { checkFileWrite } from '../files/file-guard';
import { toArrayBuffer } from '../files/to-array-buffer';

const fileHandlers: HandlerGroup = {
  id: 'file',
  register: (ctx) => {
    const { handle, files } = ctx;
    handle('file:readBytes', async (_e, path) => {
      const bytes = await files.readBytes(path);
      return bytes ? toArrayBuffer(Buffer.from(bytes)) : null;
    });
    handle('file:readText', (_e, path) => files.readText(path));
    handle('file:writeBytes', async (_e, path, data) => {
      await checkFileWrite({ kind: 'writeBytes', path }, ctx);
      await files.writeBytes(path, new Uint8Array(data));
    });
    handle('file:writeText', async (_e, path, data) => {
      await checkFileWrite({ kind: 'writeText', path }, ctx);
      await files.writeText(path, data);
    });
    handle('file:list', (_e, dir) => files.list(dir));
    handle('file:remove', async (_e, path) => {
      await checkFileWrite({ kind: 'remove', path }, ctx);
      await files.remove(path);
    });
    handle('file:trash', async (_e, path) => {
      await checkFileWrite({ kind: 'trash', path }, ctx);
      if (!files.trash) throw new Error('This host has no trash');
      await files.trash(path);
    });
    handle('file:exists', (_e, path) => files.exists(path));
    handle('file:mkdir', async (_e, dir) => {
      await checkFileWrite({ kind: 'mkdir', path: dir }, ctx);
      await files.mkdir(dir);
    });
    handle('file:stat', (_e, path) => files.stat(path));
  },
};

export { fileHandlers };
