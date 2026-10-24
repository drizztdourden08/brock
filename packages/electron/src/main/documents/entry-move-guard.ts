/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { folderMoveGuard } from './folder-move-guard';
import { openingNameGuard } from './opening-name-guard';

const entryMoveGuard = async (info: Stats, source: string, target: string): Promise<void> => {
  if (info.isDirectory()) await folderMoveGuard(source, target);
  else if (info.isSymbolicLink()) openingNameGuard(target);
};

export { entryMoveGuard };
