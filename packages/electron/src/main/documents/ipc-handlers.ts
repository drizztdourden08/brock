/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import { readFile } from 'fs/promises';
import type { HandlerGroup } from '../types/main-context.type';
import { toArrayBuffer } from '../files/to-array-buffer';
import { writeAtomic } from '../storage/write-atomic';
import { bytesOf } from './bytes-of';
import { isUnrecorded } from './is-unrecorded';
import { markOfTheWeb } from './mark-of-the-web';
import { registerRecentHandlers } from './recent-handlers';
import { registerRecoveryHandlers } from './recovery-handlers';
import { textOf } from './text-of';
import { toDialogOptions } from './to-dialog-options';
import { toFolderDialogOptions } from './to-folder-dialog-options';
import { trackingOf } from './tracking-of';

const documentHandlers: HandlerGroup = {
  id: 'document',
  register: (ctx) => {
    const { handle, window, documents } = ctx;
    const tracking = trackingOf(ctx);
    const save = async (path: string, content: () => string | Uint8Array, [profileId, options]: readonly unknown[]): Promise<void> => {
      const full = await documents.resolve(path, 'write');
      await writeAtomic(full, content());
      if (!documents.exact(full)) await markOfTheWeb(full);
      if (!isUnrecorded(options)) await tracking.saved(profileId, full, documents.exact(full));
    };

    handle('document:open', async (_event, opts, profileId) => {
      const win = window();
      if (!win) return null;
      const result = await dialog.showOpenDialog(win, { ...toDialogOptions(opts), properties: ['openFile'] });
      const picked = result.filePaths[0];
      if (result.canceled || picked === undefined) return null;
      const full = documents.allow(picked);
      await tracking.opened(profileId, full);
      return full;
    });

    handle('document:saveAs', async (_event, opts) => {
      const win = window();
      if (!win) return null;
      const result = await dialog.showSaveDialog(win, toDialogOptions(opts));
      return result.canceled || !result.filePath ? null : documents.allow(result.filePath);
    });

    handle('document:openFolder', async (_event, opts) => {
      const win = window();
      if (!win) return null;
      const result = await dialog.showOpenDialog(win, { ...toFolderDialogOptions(opts), properties: ['openDirectory'] });
      const picked = result.filePaths[0];
      return result.canceled || picked === undefined ? null : documents.allowFolder(picked);
    });

    handle('document:list', (_event, folder, options) => documents.list(folder, options));
    handle('document:read', async (_event, path) => toArrayBuffer(await readFile(await documents.resolve(path))));
    handle('document:readText', async (_event, path) => readFile(await documents.resolve(path), 'utf8'));
    handle('document:write', (_event, path, data, ...extras) => save(path, () => bytesOf(data, 'A document write'), extras));
    handle('document:writeText', (_event, path, text, ...extras) => save(path, () => textOf(text), extras));
    registerRecentHandlers(ctx, tracking);
    registerRecoveryHandlers(ctx, tracking);
  },
};

export { documentHandlers };
