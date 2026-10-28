/* @layer electron-main @kind types */
interface ClipboardOwner {
  isDestroyed: () => boolean;
  send: (channel: string) => void;
}

interface ClipboardWatchDeps {
  fingerprint: () => string;
  channel: string;
  pollMs: number;
  max: number;
  setTimer?: (tick: () => void, ms: number) => unknown;
  clearTimer?: (timer: unknown) => void;
}

interface ClipboardWatch {
  add: (owner: ClipboardOwner, id: string) => void;
  remove: (owner: ClipboardOwner, id: string) => void;
  drop: (owner: ClipboardOwner) => void;
  size: () => number;
}

export type { ClipboardOwner, ClipboardWatch, ClipboardWatchDeps };
