/* @layer electron-main @kind types */
interface WalkedFile {
  rel: string;
  full: string;
  bytes: number;
  mtimeMs: number;
}

interface ChangeFacts {
  isDirectory: boolean;
  mtimeMs: number;
}

interface CleanCount {
  removed: number;
  bytes: number;
}

export type { ChangeFacts, CleanCount, WalkedFile };
