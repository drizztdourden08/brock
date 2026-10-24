/* @layer renderer-shell @kind types */
interface DialogChoice<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

interface DialogFact {
  label: string;
  value: string;
}

type ChoiceLook = 'radio' | 'select';

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
  facts?: readonly DialogFact[];
  choices?: readonly DialogChoice[];
  choice?: string;
  look?: ChoiceLook;
  searchable?: boolean;
  alternate?: DialogAlternate;
  onConfirm: () => void;
  onCancel?: () => void;
}

type ConfirmActionOptions = Omit<ConfirmDialogConfig, 'onConfirm' | 'onCancel' | 'choices' | 'choice' | 'alternate' | 'look' | 'searchable'>;

type ConfirmSaveAnswer = 'save' | 'discard' | 'cancel';

interface ConfirmSaveOptions extends ConfirmActionOptions {
  discardLabel?: string;
}

interface ConfirmChoiceOptions<T extends string> extends ConfirmActionOptions {
  choices: readonly DialogChoice<T>[];
  initial: T;
  look?: ChoiceLook;
  searchable?: boolean;
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

export type { ChoiceLook, ConfirmActionOptions, ConfirmChoiceOptions, ConfirmDeleteOptions, ConfirmDialogConfig, ConfirmSaveAnswer, ConfirmSaveOptions, DialogAlternate, DialogChoice, DialogFact, DialogState };
