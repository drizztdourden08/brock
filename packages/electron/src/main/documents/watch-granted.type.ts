/* @layer electron-main @kind types */
import type { FolderGrants } from './folder-grants.type';
import type { WatchFn } from './watch-folder.type';
import type { WatchRegistry } from './watch-registry.type';

interface GrantedWatch {
  folders: FolderGrants;
  registry: WatchRegistry;
  watcher: WatchFn;
  ms: number;
  max: number;
}

export type { GrantedWatch };
