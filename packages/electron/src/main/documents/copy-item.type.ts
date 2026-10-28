/* @layer electron-main @kind types */
import type { FolderGrants } from './folder-grants.type';

interface CopyDeps {
  folders: FolderGrants;
  resolveSource: (path: string) => Promise<string>;
}

export type { CopyDeps };
