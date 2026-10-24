/* @layer electron-main @kind types */
interface WatchRegistry {
  add: (root: string, stop: () => void) => () => void;
  stopRoot: (root: string) => void;
  size: () => number;
}

export type { WatchRegistry };
