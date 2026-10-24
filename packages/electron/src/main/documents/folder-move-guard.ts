/* @layer electron-main @kind logic */
import { basename } from 'path';
import { LIST_LIMITS } from './list-limits.constants';
import { OPENING_SEGMENTS } from './opening-segments.constants';
import { subtreeDenied } from './subtree-denied';

const folderMoveGuard = async (source: string, target: string): Promise<void> => {
  if (OPENING_SEGMENTS.has(basename(target).toLowerCase())) {
    throw new Error(`"${target}" is a name that opens a protected folder class and may not be changed`);
  }
  if (await subtreeDenied(source, target, LIST_LIMITS.entries)) {
    throw new Error(`"${source}" holds a file that would land in a protected class at "${target}" and may not be changed`);
  }
};

export { folderMoveGuard };
