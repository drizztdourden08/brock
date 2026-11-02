/* @layer core @kind logic */
import type { FileStore } from '../platform/ports/file-store.type';
import { keepCorruptJson } from './keep-corrupt-json';
import { stripBom } from './strip-bom';

const readJson = async <T>(files: FileStore, path: string, fallback: T): Promise<T> => {
  const text = await files.readText(path);
  if (text == null) return fallback;
  try {
    return JSON.parse(stripBom(text)) as T;
  } catch (error) {
    await keepCorruptJson(files, path, text, error instanceof Error ? error.message : String(error));
    return fallback;
  }
};

export { readJson };
