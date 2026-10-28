/* @layer electron-main @kind logic */
import type { FolderGrants } from './folder-grants.type';

const folderRefusalOf = (folders: FolderGrants, path: string): string | null => {
  try {
    folders.vet(path);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

export { folderRefusalOf };
