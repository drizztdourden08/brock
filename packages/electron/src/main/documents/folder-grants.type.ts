/* @layer electron-main @kind types */
interface FolderGrants {
  allow: (path: string) => string;
  vet: (path: string) => string;
  revoke: (path: string) => boolean;
  contain: (path: string, write?: boolean) => Promise<string | null>;
  containNew: (path: string) => Promise<string | null>;
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
}

export type { FolderGrantDeps, FolderGrants, SensitiveRoots };
