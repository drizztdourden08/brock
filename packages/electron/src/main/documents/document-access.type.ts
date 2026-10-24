/* @layer electron-main @kind types */
import type { DocumentEntry, DocumentListOptions, RecentDocument } from '@drizztdourden08/brock-core/platform';

interface DocumentAccess {
  allow: (path: string) => string;
  allowFolder: (path: string) => string;
  revokeFolder: (path: string) => boolean;
  isAllowed: (path: string) => Promise<boolean>;
  resolve: (path: string) => Promise<string>;
  list: (folder: string, options?: DocumentListOptions) => Promise<DocumentEntry[]>;
  recent: (profileId?: string) => Promise<RecentDocument[]>;
}

interface DocumentAccessDeps {
  recent?: (profileId?: string) => Promise<RecentDocument[]>;
}

export type { DocumentAccess, DocumentAccessDeps };
