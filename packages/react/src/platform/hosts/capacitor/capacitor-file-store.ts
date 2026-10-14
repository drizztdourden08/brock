/* @layer renderer-shell @kind logic */
import type { FileStat, FileStore } from '@drizztdourden08/brock-core';
import { base64 } from './base64';
import { capacitorPlugins } from './capacitor-plugins';
import { DATA_DIRECTORY, UTF8 } from './capacitor.constants';
import type { FilesystemPlugin, FsTarget } from './capacitor-plugins.type';

const at = (path: string): FsTarget => ({ path, directory: DATA_DIRECTORY });

const orNull = async <T>(work: Promise<T>): Promise<T | null> => {
  try {
    return await work;
  } catch {
    return null;
  }
};

const required = (): FilesystemPlugin => {
  const files = capacitorPlugins.files();
  if (!files) throw new Error('The Filesystem plugin is not installed: add @capacitor/filesystem to the app');
  return files;
};

const textOf = (data: string | Blob): Promise<string> => (typeof data === 'string' ? Promise.resolve(data) : data.text());

const createCapacitorFileStore = (): FileStore => ({
  readBytes: async (path) => {
    const read = await orNull(required().readFile(at(path)));
    return read ? base64.decode(await textOf(read.data)) : null;
  },
  readText: async (path) => {
    const read = await orNull(required().readFile({ ...at(path), encoding: UTF8 }));
    return read ? textOf(read.data) : null;
  },
  writeBytes: async (path, data) => { await required().writeFile({ ...at(path), data: base64.encode(data), recursive: true }); },
  writeText: async (path, data) => { await required().writeFile({ ...at(path), data, encoding: UTF8, recursive: true }); },
  list: async (dir) => ((await orNull(required().readdir(at(dir))))?.files ?? []).map((entry) => entry.name),
  remove: async (path) => {
    const files = required();
    const entry = await orNull(files.stat(at(path)));
    if (entry?.type === 'directory') await files.rmdir({ ...at(path), recursive: true });
    else if (entry) await files.deleteFile(at(path));
  },
  exists: async (path) => (await orNull(required().stat(at(path)))) !== null,
  mkdir: async (dir) => { await orNull(required().mkdir({ ...at(dir), recursive: true })); },
  stat: async (path): Promise<FileStat | null> => {
    const entry = await orNull(required().stat(at(path)));
    return entry ? { bytes: entry.size ?? 0, isDirectory: entry.type === 'directory', mtimeMs: entry.mtime ?? 0 } : null;
  },
});

export { createCapacitorFileStore };
