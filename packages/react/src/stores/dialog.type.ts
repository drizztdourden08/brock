/* @layer renderer-shell @kind types */
interface DialogChoice<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

interface DialogAlternate {
  label: string;
  onSelect: () => void;
}

interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  choices?: readonly DialogChoice[];
  choice?: string;
  alternate?: DialogAlternate;
  onConfirm: () => void;
  onCancel?: () => void;
}

type ConfirmActionOptions = Omit<ConfirmDialogConfig, 'onConfirm' | 'onCancel' | 'choices' | 'choice' | 'alternate'>;

type ConfirmSaveAnswer = 'save' | 'discard' | 'cancel';

interface ConfirmSaveOptions extends ConfirmActionOptions {
  discardLabel?: string;
}

interface ConfirmChoiceOptions<T extends string> extends ConfirmActionOptions {
  choices: readonly DialogChoice<T>[];
  initial: T;
}

interface ConfirmDeleteOptions {
  what: string;
  consequence: string;
  confirmLabel?: string;
}

interface DialogState {
  dialog: ConfirmDialogConfig | null;
  show: (config: ConfirmDialogConfig) => void;
  choose: (value: string) => void;
  dismiss: () => void;
}

export type { ConfirmActionOptions, ConfirmChoiceOptions, ConfirmDeleteOptions, ConfirmDialogConfig, ConfirmSaveAnswer, ConfirmSaveOptions, DialogAlternate, DialogChoice, DialogState };
