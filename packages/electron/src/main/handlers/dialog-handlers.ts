/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import type { FileFilter, OpenDialogOptions } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { basename } from 'path';
import type { HandlerGroup } from '../types/main-context.type';
import { toArrayBuffer } from '../files/to-array-buffer';

const filtersFor = (extensions: string[]): FileFilter[] =>
  extensions.length
    ? [{ name: 'Files', extensions }, { name: 'All Files', extensions: ['*'] }]
    : [{ name: 'All Files', extensions: ['*'] }];

const dialogHandlers: HandlerGroup = {
  id: 'dialog',
  register: ({ handle, window }) => {
    handle('dialog:pickFile', async (_event, extensions) => {
      const win = window();
      if (!win) return null;
      const result = await dialog.showOpenDialog(win, { filters: filtersFor(extensions), properties: ['openFile'] });
      const picked = result.filePaths[0];
      if (result.canceled || picked === undefined) return null;
      return { name: basename(picked), data: toArrayBuffer(await readFile(picked)) };
    });

    handle('dialog:pickPath', async (_event, folder, extensions) => {
      const win = window();
      if (!win) return null;
      const options: OpenDialogOptions = folder ? { properties: ['openDirectory'] } : { filters: filtersFor(extensions), properties: ['openFile'] };
      const result = await dialog.showOpenDialog(win, options);
      return result.canceled ? null : result.filePaths[0] ?? null;
    });

    handle('dialog:saveFile', async (_event, name, data, extensions) => {
      const win = window();
      if (!win) return { saved: false, error: 'No window to attach the dialog to' };
      const result = await dialog.showSaveDialog(win, { defaultPath: name, filters: filtersFor(extensions) });
      if (result.canceled || !result.filePath) return { saved: false };
      try {
        await writeFile(result.filePath, Buffer.from(data));
        return { saved: true, name: basename(result.filePath) };
      } catch (err) {
        return { saved: false, error: err instanceof Error ? err.message : String(err) };
      }
    });
  },
};

export { dialogHandlers };
