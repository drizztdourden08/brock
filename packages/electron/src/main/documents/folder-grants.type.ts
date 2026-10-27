/* @layer electron-main @kind types */
import type { MadeFolders } from './made-folders.type';

interface FolderGrants {
  allow: (path: string) => string;
  vet: (path: string) => string;
  made: MadeFolders;
  adopt: (real: string) => string;
  revoke: (path: string) => boolean;
  contain: (path: string, write?: boolean) => Promise<string | null>;
  containNew: (path: string) => Promise<string | null>;
  containLink: (path: string) => Promise<string | null>;
  holdsProtected: (real: string) => boolean;
  covers: (real: string) => boolean;
  rootOf: (real: string) => string | null;
  holds: (root: string) => boolean;
}

interface SensitiveRoots {
  home: string[];
  trees: string[];
}

interface FolderGrantDeps {
  protectedRoots?: () => string[];
  sensitiveRoots?: () => SensitiveRoots;
  onRevoke?: (root: string) => void;
  tempRoot?: () => string;
}

export type { FolderGrantDeps, FolderGrants, SensitiveRoots };
