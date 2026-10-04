/* @layer renderer-shell @kind types */
type ConfirmFocus = 'confirm' | 'cancel';

interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  focus?: ConfirmFocus;
  onConfirm: () => void;
  onCancel?: () => void;
}

type ConfirmActionOptions = Omit<ConfirmDialogConfig, 'onConfirm' | 'onCancel'>;

interface ConfirmDeleteOptions {
  what: string;
  consequence: string;
  confirmLabel?: string;
}

interface DialogState {
  dialog: ConfirmDialogConfig | null;
  show: (config: ConfirmDialogConfig) => void;
  dismiss: () => void;
}

export type { ConfirmActionOptions, ConfirmDeleteOptions, ConfirmDialogConfig, ConfirmFocus, DialogState };
