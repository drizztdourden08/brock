/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { Result } from '@drizztdourden08/brock-core/result';
import { statShownPath } from './stat-shown-path';

const openFolder = async (path: string): Promise<Result> => {
  const found = await statShownPath(path);
  if (typeof found === 'string') return { success: false, error: found };
  if (!found.isDirectory()) return { success: false, error: `${path} is a file, not a folder: reveal it in its folder instead` };
  const error = await shell.openPath(path);
  return error ? { success: false, error } : { success: true };
};

export { openFolder };
