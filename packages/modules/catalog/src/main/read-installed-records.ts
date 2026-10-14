/* @layer electron-main @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { InstalledRecord } from '../catalog.type';
import { REGISTRY_PATH } from './catalog-main.constants';
import { parseRegistry } from './parse-registry';

const fileOf = (path: string): string => (path.toLowerCase().endsWith('.json') ? path : join(path, REGISTRY_PATH));

const textAt = async (path: string): Promise<string | null> => {
  try {
    return await readFile(fileOf(path), 'utf8');
  } catch {
    return null;
  }
};

const readInstalledRecords = async (source: Pick<FileStore, 'readText'> | string): Promise<InstalledRecord[]> => {
  const text = typeof source === 'string' ? await textAt(source) : await source.readText(REGISTRY_PATH);
  return parseRegistry(text).records;
};

export { readInstalledRecords };
