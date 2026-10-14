/* @layer electron-main @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';

const trashingFiles = (files: FileStore): FileStore => {
  const { trash } = files;
  if (!trash) return files;
  const remove = async (path: string): Promise<void> => {
    try {
      await trash.call(files, path);
    } catch {
      await files.remove(path);
    }
  };
  return Object.assign(Object.create(files) as FileStore, { remove });
};

export { trashingFiles };
