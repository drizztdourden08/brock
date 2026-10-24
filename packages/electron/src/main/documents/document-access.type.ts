/* @layer electron-main @kind types */
import type { DocumentListing, DocumentListOptions, DocumentMkdirOptions, DocumentRenameOptions, DocumentWatchListener, DocumentWatchOptions, RecentDocument, RememberedFolder } from '@drizztdourden08/brock-core/platform';
import type { SensitiveRoots } from './folder-grants.type';
import type { ListLimits } from './list-limits.type';
import type { RememberedFolders } from './remembered-folders.type';
import type { WatchFn } from './watch-folder.type';

interface DocumentAccess {
  allow: (path: string) => string;
  allowFolder: (path: string) => string;
  revokeFolder: (path: string) => boolean;
  folderRefusal: (path: string) => string | null;
  exact: (path: string) => boolean;
  isAllowed: (path: string) => Promise<boolean>;
  resolve: (path: string, intent?: 'read' | 'write') => Promise<string>;
  list: (folder: string, options?: DocumentListOptions) => Promise<DocumentListing>;
  recent: (profileId?: string) => Promise<RecentDocument[]>;
  trash: (path: string) => Promise<void>;
  rename: (from: string, to: string, options?: DocumentRenameOptions) => Promise<void>;
  mkdir: (path: string, options?: DocumentMkdirOptions) => Promise<void>;
  watch: (folder: string, options: DocumentWatchOptions | undefined, listener: DocumentWatchListener) => Promise<() => void>;
  rememberFolder: (profileId: string, path: string) => Promise<void>;
  rememberedFolders: (profileId: string) => Promise<RememberedFolder[]>;
  regrant: (profileId: string, path: string) => Promise<string>;
  forgetFolder: (profileId: string, path: string) => Promise<boolean>;
}

interface DocumentAccessDeps {
  protectedRoots?: () => string[];
  sensitiveRoots?: () => SensitiveRoots;
  limits?: Partial<ListLimits>;
  recent?: (profileId?: string) => Promise<RecentDocument[]>;
  memory?: () => RememberedFolders;
  trashItem?: (path: string) => Promise<void>;
  watcher?: WatchFn;
  watchMs?: number;
}

export type { DocumentAccess, DocumentAccessDeps };
