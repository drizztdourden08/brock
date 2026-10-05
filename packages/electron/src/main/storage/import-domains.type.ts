/* @layer electron-main @kind types */
interface Placed {
  files: number;
  kept: number;
}

interface Incoming {
  rel: string;
  modified: Date;
  write: (full: string) => Promise<void>;
}

export type { Incoming, Placed };
