/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { appendMainLog } from '../logs/append-main-log';

const readJsonFile = async <T>(file: string, fallback: T): Promise<T> => {
  try {
    const data = await readFile(file, 'utf-8');
    return JSON.parse(stripBom(data)) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      appendMainLog('warn', `[json-store] Failed to read ${file}, using fallback: ${String(err)}`);
    }
    return fallback;
  }
};

export { readJsonFile };
