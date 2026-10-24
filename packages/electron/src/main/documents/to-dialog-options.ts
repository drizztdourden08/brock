/* @layer electron-main @kind logic */
import type { FileFilter } from 'electron';
import type { DocumentDialogOptions } from '@drizztdourden08/brock-core/platform';
import { toFolderDialogOptions } from './to-folder-dialog-options';
import type { DialogOptions } from './to-dialog-options.type';
import { ANY_FILE } from './to-dialog-options.constants';

const extensionsOf = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((ext): ext is string => typeof ext === 'string').map((ext) => ext.replace(/^\*?\./, '')).filter((ext) => ext !== '') : [];

const filtersOf = (value: unknown): FileFilter[] => {
  if (!Array.isArray(value)) return [ANY_FILE];
  const filters = value.flatMap((entry: Partial<FileFilter> | null): FileFilter[] => {
    const extensions = extensionsOf(entry?.extensions);
    return typeof entry?.name === 'string' && extensions.length > 0 ? [{ name: entry.name, extensions }] : [];
  });
  return filters.length > 0 ? filters : [ANY_FILE];
};

const toDialogOptions = (opts: DocumentDialogOptions | undefined): DialogOptions => ({
  ...toFolderDialogOptions(opts),
  filters: filtersOf(opts?.filters),
});

export { toDialogOptions };
