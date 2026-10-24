/* @layer electron-main @kind types */
import type { RememberedFolder } from '@drizztdourden08/brock-core/platform';

interface RememberedFolders {
  list: (profileId: string) => Promise<RememberedFolder[]>;
  find: (profileId: string, path: string) => Promise<string | null>;
  remember: (profileId: string, real: string) => Promise<void>;
  forget: (profileId: string, path: string) => Promise<boolean>;
}

interface RememberedDeps {
  profileDir: (profileId: string) => string;
  exists: (path: string) => Promise<boolean>;
  key: () => Promise<Buffer>;
  now?: () => number;
}

export type { RememberedDeps, RememberedFolders };
