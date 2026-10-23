/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import { readFile } from 'fs/promises';
import { types } from 'util';
import type { HandlerGroup } from '../types/main-context.type';
import { toArrayBuffer } from '../files/to-array-buffer';
import { writeAtomic } from '../storage/write-atomic';
import { toDialogOptions } from './to-dialog-options';

const bytesOf = (data: unknown): Uint8Array => {
  if (!types.isAnyArrayBuffer(data)) throw new Error('A document write needs bytes');
  return new Uint8Array(data);
};

const documentHandlers: HandlerGroup = {
  id: 'document',
  register: ({ handle, window, documents }) => {
    handle('document:open', async (_event, opts) => {
      const win = window();
      if (!win) return null;
      const result = await dialog.showOpenDialog(win, { ...toDialogOptions(opts), properties: ['openFile'] });
      const picked = result.filePaths[0];
      return result.canceled || picked === undefined ? null : documents.allow(picked);
    });

    handle('document:saveAs', async (_event, opts) => {
      const win = window();
      if (!win) return null;
      const result = await dialog.showSaveDialog(win, toDialogOptions(opts));
      return result.canceled || !result.filePath ? null : documents.allow(result.filePath);
    });

    handle('document:read', async (_event, path) => toArrayBuffer(await readFile(documents.resolve(path))));
    handle('document:readText', (_event, path) => readFile(documents.resolve(path), 'utf8'));
    handle('document:write', (_event, path, data) => writeAtomic(documents.resolve(path), bytesOf(data)));
    handle('document:writeText', (_event, path, text) => {
      if (typeof text !== 'string') throw new Error('A document text write needs a string');
      return writeAtomic(documents.resolve(path), text);
    });
  },
};

export { documentHandlers };
