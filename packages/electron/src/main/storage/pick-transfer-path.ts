/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import type { BrowserWindow, OpenDialogOptions } from 'electron';
import { join } from 'path';
import type { DataExportFormat } from '@drizztdourden08/brock-core/platform';
import { ZIP_FILTERS } from './storage.constants';

const exportName = (appId: string): string => `${appId}-data-${new Date().toISOString().slice(0, 10)}`;

const openPath = async (win: BrowserWindow | null, options: OpenDialogOptions): Promise<string | null> => {
  const result = win ? await dialog.showOpenDialog(win, options) : await dialog.showOpenDialog(options);
  return result.canceled ? null : result.filePaths[0] ?? null;
};

const pickTransferPath = async (win: BrowserWindow | null, appId: string, format: DataExportFormat, direction: 'export' | 'import'): Promise<string | null> => {
  if (direction === 'import') {
    return openPath(win, format === 'zip' ? { filters: ZIP_FILTERS, properties: ['openFile'] } : { properties: ['openDirectory'] });
  }
  if (format === 'folder') {
    const parent = await openPath(win, { title: 'Choose where the export folder goes', properties: ['openDirectory', 'createDirectory'] });
    return parent === null ? null : join(parent, exportName(appId));
  }
  const options = { defaultPath: `${exportName(appId)}.zip`, filters: ZIP_FILTERS };
  const result = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options);
  return result.canceled || !result.filePath ? null : result.filePath;
};

export { pickTransferPath };
