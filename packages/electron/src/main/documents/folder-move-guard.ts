/* @layer electron-main @kind logic */
import { LIST_LIMITS } from './list-limits.constants';
import { openingNameGuard } from './opening-name-guard';
import { subtreeDenied } from './subtree-denied';

const folderMoveGuard = async (source: string, target: string): Promise<void> => {
  openingNameGuard(target);
  if (await subtreeDenied(source, target, LIST_LIMITS.entries)) {
    throw new Error(`"${source}" holds a file that would land in a protected class at "${target}" and may not be changed`);
  }
};

export { folderMoveGuard };
