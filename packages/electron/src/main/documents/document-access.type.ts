/* @layer electron-main @kind types */
import type { DocumentListing, DocumentListOptions, RecentDocument } from '@drizztdourden08/brock-core/platform';
import type { ListLimits } from './list-limits.type';

interface DocumentAccess {
  allow: (path: string) => string;
  allowFolder: (path: string) => string;
  revokeFolder: (path: string) => boolean;
  exact: (path: string) => boolean;
  isAllowed: (path: string) => Promise<boolean>;
  resolve: (path: string, intent?: 'read' | 'write') => Promise<string>;
  list: (folder: string, options?: DocumentListOptions) => Promise<DocumentListing>;
  recent: (profileId?: string) => Promise<RecentDocument[]>;
}

interface DocumentAccessDeps {
  protectedRoots?: () => string[];
  sensitiveRoots?: () => string[];
  limits?: Partial<ListLimits>;
  recent?: (profileId?: string) => Promise<RecentDocument[]>;
}

export type { DocumentAccess, DocumentAccessDeps };
