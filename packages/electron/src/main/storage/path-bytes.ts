/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import { walkFiles } from './walk-files';

const pathBytes = async (full: string): Promise<number> => {
  const facts = await stat(full).catch(() => null);
  if (!facts) return 0;
  if (!facts.isDirectory()) return facts.size;
  return (await walkFiles(full)).reduce((sum, file) => sum + file.bytes, 0);
};

export { pathBytes };
