/* @layer electron-main @kind logic */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { MainPaths } from '@drizztdourden08/brock-electron/main';

const sanitizeFileStem = (name: string): string => name.replace(/[^A-Za-z0-9_-]/g, '_');

const writeDebugCapture = async (paths: MainPaths, name: string, data: unknown): Promise<string> => {
  const filePath = paths.data('debug', `${sanitizeFileStem(name)}-${Date.now()}.json`);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return filePath;
};

export { writeDebugCapture };
