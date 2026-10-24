/* @layer electron-main @kind logic */
import type { DocumentFolderOptions } from '@drizztdourden08/brock-core/platform';
import type { FolderDialogOptions } from './to-dialog-options.type';

const toFolderDialogOptions = (opts: DocumentFolderOptions | undefined): FolderDialogOptions => ({
  ...(typeof opts?.title === 'string' ? { title: opts.title } : {}),
  ...(typeof opts?.defaultPath === 'string' && opts.defaultPath !== '' ? { defaultPath: opts.defaultPath } : {}),
});

export { toFolderDialogOptions };
