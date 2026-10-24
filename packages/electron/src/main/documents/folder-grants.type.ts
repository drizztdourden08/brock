/* @layer electron-main @kind types */
interface FolderGrants {
  allow: (path: string) => string;
  revoke: (path: string) => boolean;
  contain: (path: string) => Promise<string | null>;
  covers: (real: string) => boolean;
  rootOf: (real: string) => string | null;
  holds: (root: string) => boolean;
}

interface FolderGrantDeps {
  protectedRoots?: () => string[];
}

export type { FolderGrantDeps, FolderGrants };
