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

type AlternateTone = 'danger' | 'neutral';

interface DialogAlternate {
  label: string;
  onSelect: () => void;
  tone?: AlternateTone;
}

interface ConfirmAlternate {
  label: string;
  onSelect: () => void;
  tone?: AlternateTone;
  closes?: boolean;
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

type ConfirmBaseOptions = Omit<ConfirmDialogConfig, 'onConfirm' | 'onCancel' | 'choices' | 'choice' | 'alternate' | 'look' | 'searchable'>;

interface ConfirmActionOptions extends ConfirmBaseOptions {
  alternate?: ConfirmAlternate;
}

type ConfirmSaveAnswer = 'save' | 'discard' | 'cancel';

interface ConfirmSaveOptions extends ConfirmBaseOptions {
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

export type { AlternateTone, ChoiceLook, ConfirmActionOptions, ConfirmAlternate, ConfirmChoiceOptions, ConfirmDeleteOptions, ConfirmDialogConfig, ConfirmSaveAnswer, ConfirmSaveOptions, DialogAlternate, DialogChoice, DialogFact, DialogState };
