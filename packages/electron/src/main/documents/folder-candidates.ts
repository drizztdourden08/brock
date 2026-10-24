/* @layer electron-main @kind logic */
import { realpathSync } from 'fs';
import { dirname } from 'path';

const folderCandidates = (file: string, levels: number): string[] => {
  const parent = realpathSync.native(dirname(file));
  const folders = [parent];
  for (let level = 1; level <= levels; level += 1) folders.push(dirname(folders[level - 1] ?? parent));
  return folders;
};

export { folderCandidates };
