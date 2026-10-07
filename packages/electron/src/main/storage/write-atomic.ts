/* @layer electron-main @kind logic */
import { randomUUID } from 'crypto';
import { mkdir, rename, rm, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { JSON_TEMP_SUFFIX } from './storage.constants';

const pending = new Map<string, Promise<void>>();

const keyOf = (full: string): string => {
  const key = resolve(full);
  return process.platform === 'win32' ? key.toLowerCase() : key;
};

const writeNow = async (full: string, data: string | Uint8Array): Promise<void> => {
  await mkdir(dirname(full), { recursive: true });
  const partial = `${full}.${randomUUID()}${JSON_TEMP_SUFFIX}`;
  try {
    await writeFile(partial, data);
    await rename(partial, full);
  } catch (error) {
    await rm(partial, { force: true });
    throw error;
  }
};

const writeAtomic = (full: string, data: string | Uint8Array): Promise<void> => {
  const key = keyOf(full);
  const write = (pending.get(key) ?? Promise.resolve()).then(() => writeNow(full, data));
  const settled = write.then(() => undefined, () => undefined);
  pending.set(key, settled);
  void settled.then(() => {
    if (pending.get(key) === settled) pending.delete(key);
  });
  return write;
};

export { writeAtomic };
