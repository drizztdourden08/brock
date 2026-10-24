/* @layer electron-main @kind types */
interface AtomicFileOps {
  mkdir: (dir: string) => Promise<void>;
  writeSynced: (file: string, data: string | Uint8Array) => Promise<void>;
  rename: (from: string, to: string) => Promise<void>;
  remove: (file: string) => Promise<void>;
  pause: (ms: number) => Promise<void>;
}

interface WritableHandle {
  writeFile: (data: string | Uint8Array) => Promise<void>;
  sync: () => Promise<void>;
  close: () => Promise<void>;
}

type OpenFile = (file: string, flags: 'w', mode?: number) => Promise<WritableHandle>;

export type { AtomicFileOps, OpenFile };
