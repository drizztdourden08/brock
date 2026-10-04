/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import type { ChangeFacts } from './storage.type';
import { walkFiles } from './walk-files';

const newestChange = async (full: string): Promise<ChangeFacts> => {
  const facts = await stat(full).catch(() => null);
  if (!facts) return { isDirectory: false, mtimeMs: 0 };
  if (!facts.isDirectory()) return { isDirectory: false, mtimeMs: facts.mtimeMs };
  const files = await walkFiles(full);
  return { isDirectory: true, mtimeMs: files.reduce((newest, file) => Math.max(newest, file.mtimeMs), facts.mtimeMs) };
};

export { newestChange };
