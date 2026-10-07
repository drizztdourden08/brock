/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { Result } from '@drizztdourden08/brock-core/result';
import { statShownPath } from './stat-shown-path';

const revealPath = async (path: string): Promise<Result> => {
  const found = await statShownPath(path);
  if (typeof found === 'string') return { success: false, error: found };
  shell.showItemInFolder(path);
  return { success: true };
};

export { revealPath };
