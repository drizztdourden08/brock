/* @layer electron-main @kind types */
interface FolderGrants {
  allow: (path: string) => string;
  revoke: (path: string) => boolean;
  contain: (path: string, write?: boolean) => Promise<string | null>;
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
}

export type { FolderGrantDeps, FolderGrants, SensitiveRoots };
