/* @layer core @kind types */
import type { DocumentDialogOptions, DocumentWriteOptions, RecentDocument, RecoverableSnapshot, SnapshotWrite } from '../platform/ports/documents.type';

interface DocumentInvokeContract {
  'document:open': (opts?: DocumentDialogOptions, profileId?: string) => Promise<string | null>;
  'document:saveAs': (opts?: DocumentDialogOptions) => Promise<string | null>;
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

export type { DocumentInvokeContract };
