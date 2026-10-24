/* @layer electron-main @kind types */
interface FolderGrants {
  allow: (path: string) => string;
  revoke: (path: string) => boolean;
  contain: (path: string) => Promise<string | null>;
  covers: (real: string) => boolean;
}

export type { FolderGrants };
