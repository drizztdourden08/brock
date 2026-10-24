/* @layer electron-main @kind types */
import type { FileFilter } from 'electron';

interface FolderDialogOptions {
  title?: string;
  defaultPath?: string;
}

interface DialogOptions extends FolderDialogOptions {
  filters: FileFilter[];
}

export type { DialogOptions, FolderDialogOptions };
