/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface PickingButtonsProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled: boolean;
  children: ReactNode;
}

interface StopButtonProps {
  onStop: () => void;
}

interface StartPickSkipButtonsProps {
  onStart: () => void;
  onPick: () => void;
  onSkip: () => void;
  disabled: boolean;
}

export type { PickingButtonsProps, StartPickSkipButtonsProps, StopButtonProps };
