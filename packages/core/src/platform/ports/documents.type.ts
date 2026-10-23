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
  read: (path: string) => Promise<Uint8Array>;
  readText: (path: string) => Promise<string>;
  write: (path: string, data: Uint8Array) => Promise<void>;
  writeText: (path: string, text: string) => Promise<void>;
  recent: () => Promise<RecentDocument[]>;
  clearRecent: () => Promise<void>;
  openRecent: (path: string) => Promise<string | null>;
  snapshot: (key: string, data: Uint8Array, meta?: SnapshotMeta) => Promise<void>;
  recoverable: () => Promise<RecoverableSnapshot[]>;
  restoreSnapshot: (key: string) => Promise<Uint8Array | null>;
  discardSnapshot: (key: string) => Promise<void>;
}

export type { DocumentDialogOptions, DocumentFilter, DocumentsPort, RecentDocument, RecoverableSnapshot, SnapshotMeta, SnapshotWrite };
