/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';
import { join } from 'path';
import type { DebugFile } from './bug-report.type';
import { DEBUG_FILE } from './bug-report.constants';

const collectDebugFiles = async (debugDir: string): Promise<DebugFile[]> => {
  const entries = await readdir(debugDir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && DEBUG_FILE.test(entry.name))
    .map((entry) => ({ name: entry.name, path: join(debugDir, entry.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export { collectDebugFiles };
