/* @layer renderer-shell @kind types */
interface PinState {
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
}

export type { PinState };
