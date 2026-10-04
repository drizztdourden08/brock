/* @layer renderer-shell @kind types */
import type { ConfirmDialogConfig } from '../../../../stores/dialog.type';

interface CancelFirstDialogProps {
  dialog: ConfirmDialogConfig;
  onCancel: () => void;
}

export type { CancelFirstDialogProps };
