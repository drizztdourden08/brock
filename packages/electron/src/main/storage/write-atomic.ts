/* @layer electron-main @kind logic */
import { randomUUID } from 'crypto';
import { dirname, resolve } from 'path';
import type { AtomicFileOps } from './write-atomic.type';
import { atomicFileOps } from './atomic-file-ops';
import { replaceFile } from './replace-file';
import { JSON_TEMP_SUFFIX } from './storage.constants';

const pending = new Map<string, Promise<void>>();

const keyOf = (full: string): string => {
  const key = resolve(full);
  return process.platform === 'win32' ? key.toLowerCase() : key;
};

const writeNow = async (full: string, data: string | Uint8Array, ops: AtomicFileOps): Promise<void> => {
  await ops.mkdir(dirname(full));
  const partial = `${full}.${randomUUID()}${JSON_TEMP_SUFFIX}`;
  try {
    await ops.writeSynced(partial, data);
    await replaceFile(partial, full, ops);
  } catch (error) {
    await ops.remove(partial).catch(() => undefined);
    throw error;
  }
};

const writeAtomic = (full: string, data: string | Uint8Array, ops: AtomicFileOps = atomicFileOps): Promise<void> => {
  const key = keyOf(full);
  const write = (pending.get(key) ?? Promise.resolve()).then(() => writeNow(full, data, ops));
  const settled = write.then(() => undefined, () => undefined);
  pending.set(key, settled);
  void settled.then(() => {
    if (pending.get(key) === settled) pending.delete(key);
  });
  return write;
};

export { writeAtomic };
