/* @layer electron-main @kind types */
import type { StoredRecent } from './recent-documents.type';

interface SignedEntries {
  load: (profileId: string) => Promise<StoredRecent[]>;
  save: (profileId: string, list: StoredRecent[]) => Promise<void>;
  present: (profileId: string) => Promise<StoredRecent[]>;
}

interface SignedEntriesDeps {
  fileOf: (profileId: string) => string;
  key: () => Promise<Buffer>;
  signed: (key: Buffer, profileId: string, path: string, sig: string) => boolean;
  exists: (path: string) => Promise<boolean>;
}

export type { SignedEntries, SignedEntriesDeps };
