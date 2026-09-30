/* @layer renderer-shell @kind types */
interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel?: () => void;
}

type ConfirmActionOptions = Omit<ConfirmDialogConfig, 'onConfirm' | 'onCancel'>;

interface DialogState {
  dialog: ConfirmDialogConfig | null;
  show: (config: ConfirmDialogConfig) => void;
  dismiss: () => void;
}

export type { ConfirmDialogConfig, ConfirmActionOptions, DialogState };
