/* @layer core @kind types */
import type { DocumentDialogOptions, DocumentPick, DocumentFolderOptions, DocumentListing, DocumentListOptions, DocumentMkdirOptions, DocumentRenameOptions, DocumentRevealResult, DocumentWatchEvent, DocumentWatchOptions, DocumentWriteOptions, RecentDocument, RememberedFolder, RecoverableSnapshot, SnapshotWrite } from '../platform/ports/documents.type';

interface DocumentInvokeContract {
  'document:open': (opts?: DocumentDialogOptions, profileId?: string) => Promise<string | DocumentPick | null>;
  'document:saveAs': (opts?: DocumentDialogOptions, profileId?: string) => Promise<string | DocumentPick | null>;
  'document:openFolder': (opts?: DocumentFolderOptions, profileId?: string) => Promise<string | null>;
  'document:list': (folder: string, options?: DocumentListOptions) => Promise<DocumentListing>;
  'document:revokeFolder': (path: string) => Promise<boolean>;
  'document:trash': (path: string) => Promise<void>;
  'document:reveal': (path: string) => Promise<DocumentRevealResult>;
  'document:rename': (from: string, to: string, options?: DocumentRenameOptions) => Promise<void>;
  'document:mkdir': (path: string, options?: DocumentMkdirOptions) => Promise<void>;
  'document:watch': (id: string, folder: string, options: DocumentWatchOptions) => Promise<void>;
  'document:unwatch': (id: string) => Promise<void>;
  'document:rememberedFolders': (profileId: string) => Promise<RememberedFolder[]>;
  'document:regrant': (profileId: string, path: string) => Promise<string>;
  'document:forgetFolder': (profileId: string, path: string) => Promise<boolean>;
  'document:read': (path: string) => Promise<ArrayBuffer>;
  'document:readText': (path: string) => Promise<string>;
  'document:write': (path: string, data: ArrayBuffer, profileId?: string, options?: DocumentWriteOptions) => Promise<void>;
  'document:writeText': (path: string, text: string, profileId?: string, options?: DocumentWriteOptions) => Promise<void>;
  'document:recent': (profileId: string) => Promise<RecentDocument[]>;
  'document:clearRecent': (profileId: string) => Promise<void>;
  'document:openRecent': (profileId: string, path: string) => Promise<string | null>;
  'document:snapshot': (profileId: string, snapshot: SnapshotWrite) => Promise<void>;
  'document:recoverable': (profileId: string) => Promise<RecoverableSnapshot[]>;
  'document:restoreSnapshot': (profileId: string, key: string) => Promise<ArrayBuffer | null>;
  'document:discardSnapshot': (profileId: string, key: string) => Promise<void>;
}

interface DocumentEventContract {
  'document:watchEvent': (id: string, event: DocumentWatchEvent) => void;
}

export type { DocumentEventContract, DocumentInvokeContract };
