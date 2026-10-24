/* @layer electron-main @kind logic */
import { MAX_FOLDER_LEVELS } from './grant-containing-folder.constants';

const folderLevels = (option: unknown): number | null => {
  if (option === 'ask') return 0;
  if (typeof option !== 'object' || option === null) return null;
  const { ask, levels } = option as { ask?: unknown; levels?: unknown };
  if (ask !== true) return null;
  if (levels === undefined) return 0;
  if (typeof levels !== 'number' || !Number.isInteger(levels) || levels < 0) return null;
  return Math.min(levels, MAX_FOLDER_LEVELS);
};

export { folderLevels };
