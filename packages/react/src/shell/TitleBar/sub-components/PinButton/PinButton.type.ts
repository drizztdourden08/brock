/* @layer renderer-shell @kind types */
interface PinButtonProps {
  pinned: boolean;
  onToggle: () => Promise<void>;
}

export type { PinButtonProps };
