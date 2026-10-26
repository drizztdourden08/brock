/* @layer electron-main @kind types */
interface Held {
  text: string;
  bytes: number;
}

interface LogState {
  fd: number | null;
  path: string | undefined;
  broken: boolean;
  closed: boolean;
  headBytes: number;
  headFull: boolean;
  tail: Held[];
  tailBytes: number;
  omittedLines: number;
  omittedBytes: number;
}

export type { Held, LogState };
