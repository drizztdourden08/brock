/* @layer electron-main @kind types */
import type { RecentDocument } from '@drizztdourden08/brock-core/platform';

interface OsRecent {
  add: (path: string) => void;
  clear: () => void;
}

interface StoredRecent extends RecentDocument {
  sig: string;
}

interface RecentDeps {
  profileDir: (profileId: string) => string;
  exists: (path: string) => Promise<boolean>;
  allow: (path: string) => string;
  key: () => Promise<Buffer>;
  os: OsRecent;
  now?: () => number;
}

interface RecentDocuments {
  list: (profileId: string) => Promise<RecentDocument[]>;
  record: (profileId: string, path: string) => Promise<void>;
  clear: (profileId: string) => Promise<void>;
  reopen: (profileId: string, path: string) => Promise<string | null>;
}

export type { OsRecent, RecentDeps, RecentDocuments, StoredRecent };
