/* @layer renderer-shell @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const createLocalFileStore = (prefix: string): FileStore => {
  const read = (path: string): string | null => storage()?.getItem(`${prefix}${path}`) ?? null;
  const write = (path: string, text: string): void => { storage()?.setItem(`${prefix}${path}`, text); };
  const keys = (): string[] => {
    const store = storage();
    if (!store) return [];
    return Array.from({ length: store.length }, (_, i) => store.key(i) ?? '').filter((key) => key.startsWith(prefix));
  };

  return {
    readText: (path) => Promise.resolve(read(path)),
    writeText: (path, data) => Promise.resolve(write(path, data)),
    readBytes: (path) => {
      const text = read(path);
      return Promise.resolve(text === null ? null : new TextEncoder().encode(text));
    },
    writeBytes: (path, data) => Promise.resolve(write(path, new TextDecoder().decode(data))),
    list: (dir) => Promise.resolve(keys().map((key) => key.slice(prefix.length)).filter((path) => path.startsWith(`${dir}/`))),
    remove: (path) => Promise.resolve(storage()?.removeItem(`${prefix}${path}`)),
    exists: (path) => Promise.resolve(read(path) !== null),
    mkdir: () => Promise.resolve(),
    stat: (path) => {
      const text = read(path);
      return Promise.resolve(text === null ? null : { bytes: text.length, isDirectory: false, mtimeMs: 0 });
    },
  };
};

export { createLocalFileStore };
