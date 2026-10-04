/* @layer electron-main @kind logic */
import { mkdir, rename, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { JSON_TEMP_SUFFIX } from './storage.constants';

const writeAtomic = async (full: string, data: string | Uint8Array): Promise<void> => {
  await mkdir(dirname(full), { recursive: true });
  const partial = `${full}${JSON_TEMP_SUFFIX}`;
  await writeFile(partial, data);
  await rename(partial, full);
};

export { writeAtomic };
