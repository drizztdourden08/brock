/* @layer renderer-shell @kind types */
import type { RefObject } from 'react';
import type { DialogAlternate } from '../../../../stores/dialog.type';

interface ConfirmActionsProps {
  alternate?: DialogAlternate;
  confirmLabel?: string;
  cancelLabel?: string;
  danger: boolean;
  confirmRef: RefObject<HTMLButtonElement | null>;
  cancelRef: RefObject<HTMLButtonElement | null>;
  onConfirm: () => void;
  onCancel: () => void;
}

export type { ConfirmActionsProps };
