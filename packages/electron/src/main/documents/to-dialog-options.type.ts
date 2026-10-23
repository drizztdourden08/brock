/* @layer electron-main @kind types */
import type { FileFilter } from 'electron';

interface DialogOptions {
  title?: string;
  defaultPath?: string;
  filters: FileFilter[];
}

export type { DialogOptions };
