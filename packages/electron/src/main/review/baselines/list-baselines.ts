/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';
import { PNG_EXTENSION } from './review-baselines.constants';

const listBaselines = async (setDir: string): Promise<string[]> => {
  try {
    const names = await readdir(setDir);
    return names.filter((name) => name.toLowerCase().endsWith(PNG_EXTENSION)).map((name) => name.slice(0, -PNG_EXTENSION.length)).sort();
  } catch {
    return [];
  }
};

export { listBaselines };
