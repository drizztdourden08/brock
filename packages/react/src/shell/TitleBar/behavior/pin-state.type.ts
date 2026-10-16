/* @layer renderer-shell @kind types */
interface PinState {
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
}

interface TuckedControls {
  pin: boolean;
  fullscreen: boolean;
}

export type { PinState, TuckedControls };
