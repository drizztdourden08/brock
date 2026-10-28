/* @layer electron-main @kind types */
interface ClipboardWatchDeps {
  fingerprint: () => string;
  changed: () => void;
  pollMs: number;
  max: number;
  setTimer?: (tick: () => void, ms: number) => unknown;
  clearTimer?: (timer: unknown) => void;
}

interface ClipboardWatch {
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  size: () => number;
}

export type { ClipboardWatch, ClipboardWatchDeps };
