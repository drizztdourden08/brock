/* @layer core @kind types */
interface DocumentFilter {
  name: string;
  extensions: string[];
}

interface DocumentDialogOptions {
  title?: string;
  filters?: DocumentFilter[];
  defaultPath?: string;
}

interface DocumentFolderOptions {
  title?: string;
  defaultPath?: string;
}

interface DocumentListOptions {
  extensions?: string[];
  recursive?: boolean;
}

type DocumentEntryKind = 'file' | 'folder';

interface DocumentEntry {
  path: string;
  name: string;
  kind: DocumentEntryKind;
  size: number;
  modified: number;
  link: boolean;
}

interface DocumentListing {
  entries: DocumentEntry[];
  truncated: boolean;
}

interface DocumentRenameOptions {
  overwrite?: boolean;
}

interface DocumentMkdirOptions {
  recursive?: boolean;
}

interface DocumentWatchOptions {
  recursive?: boolean;
}

type DocumentWatchKind = 'add' | 'change' | 'remove';

interface DocumentWatchEvent {
  kind: DocumentWatchKind;
  path: string;
}

type DocumentWatchListener = (event: DocumentWatchEvent) => void;

interface RememberedFolder {
  path: string;
  name: string;
  lastOpened: number;
  available: boolean;
}

interface DocumentWriteOptions {
  recent?: boolean;
}

interface RecentDocument {
  path: string;
  name: string;
  lastOpened: number;
}

interface SnapshotMeta {
  name?: string;
  path?: string;
}

interface SnapshotWrite extends SnapshotMeta {
  key: string;
  data: ArrayBuffer;
}

interface RecoverableSnapshot {
  key: string;
  name: string | null;
  path: string | null;
  savedAt: number;
  size: number;
}

interface DocumentsPort {
  open: (opts?: DocumentDialogOptions) => Promise<string | null>;
  saveAs: (opts?: DocumentDialogOptions) => Promise<string | null>;
  openFolder: (opts?: DocumentFolderOptions) => Promise<string | null>;
  list: (folder: string, options?: DocumentListOptions) => Promise<DocumentListing>;
  revokeFolder: (path: string) => Promise<boolean>;
  trash: (path: string) => Promise<void>;
  rename: (from: string, to: string, options?: DocumentRenameOptions) => Promise<void>;
  mkdir: (path: string, options?: DocumentMkdirOptions) => Promise<void>;
  watch: (folder: string, options: DocumentWatchOptions, listener: DocumentWatchListener) => Promise<() => void>;
  rememberedFolders: () => Promise<RememberedFolder[]>;
  regrant: (path: string) => Promise<string>;
  forgetFolder: (path: string) => Promise<boolean>;
  read: (path: string) => Promise<Uint8Array>;
  readText: (path: string) => Promise<string>;
  write: (path: string, data: Uint8Array, options?: DocumentWriteOptions) => Promise<void>;
  writeText: (path: string, text: string, options?: DocumentWriteOptions) => Promise<void>;
  recent: () => Promise<RecentDocument[]>;
  clearRecent: () => Promise<void>;
  openRecent: (path: string) => Promise<string | null>;
  snapshot: (key: string, data: Uint8Array, meta?: SnapshotMeta) => Promise<void>;
  recoverable: () => Promise<RecoverableSnapshot[]>;
  restoreSnapshot: (key: string) => Promise<Uint8Array | null>;
  discardSnapshot: (key: string) => Promise<void>;
}

export type { DocumentDialogOptions, DocumentEntry, DocumentEntryKind, DocumentFilter, DocumentFolderOptions, DocumentListing, DocumentListOptions, DocumentMkdirOptions, DocumentRenameOptions, DocumentsPort, DocumentWatchEvent, DocumentWatchKind, DocumentWatchListener, DocumentWatchOptions, DocumentWriteOptions, RecentDocument, RememberedFolder, RecoverableSnapshot, SnapshotMeta, SnapshotWrite };
