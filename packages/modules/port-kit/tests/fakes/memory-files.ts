/* @layer core @kind test */
import type { FileStore } from '@drizztdourden08/brock-core/platform';

const memoryFiles = (): { files: FileStore; disk: Map<string, Uint8Array> } => {
  const disk = new Map<string, Uint8Array>();
  const childrenOf = (dir: string): string[] =>
    [...disk.keys()].filter((key) => key.startsWith(`${dir}/`)).map((key) => key.slice(dir.length + 1)).filter((rest) => !rest.includes('/'));
  const files: FileStore = {
    readBytes: (path) => Promise.resolve(disk.get(path) ?? null),
    readText: (path) => Promise.resolve(disk.has(path) ? new TextDecoder().decode(disk.get(path)) : null),
    writeBytes: (path, data) => Promise.resolve(void disk.set(path, data)),
    writeText: (path, data) => Promise.resolve(void disk.set(path, new TextEncoder().encode(data))),
    list: (dir) => Promise.resolve(childrenOf(dir)),
    remove: (path) => Promise.resolve(void disk.delete(path)),
    exists: (path) => Promise.resolve(disk.has(path)),
    mkdir: () => Promise.resolve(),
    stat: () => Promise.resolve(null),
  };
  return { files, disk };
};

export { memoryFiles };
