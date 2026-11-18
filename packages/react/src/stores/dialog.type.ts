/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

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
  label: Text;
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

type ConfirmBase = Omit<ConfirmDialogConfig, 'onConfirm' | 'onCancel' | 'choices' | 'choice' | 'alternate' | 'look' | 'searchable'>;

interface DialogFactInput {
  label: Text;
  value: Text;
}

interface DialogChoiceInput<T extends string = string> {
  value: T;
  label: Text;
  description?: Text;
}

type ConfirmBaseOptions = Omit<ConfirmBase, 'title' | 'message' | 'confirmLabel' | 'cancelLabel' | 'facts'> & {
  title: Text;
  message: Text;
  confirmLabel?: Text;
  cancelLabel?: Text;
  facts?: readonly DialogFactInput[];
};

interface ConfirmActionOptions extends ConfirmBaseOptions {
  alternate?: ConfirmAlternate;
}

type ConfirmSaveAnswer = 'save' | 'discard' | 'cancel';

interface ConfirmSaveOptions extends ConfirmBaseOptions {
  discardLabel?: Text;
}

interface ConfirmChoiceOptions<T extends string> extends ConfirmActionOptions {
  choices: readonly DialogChoiceInput<T>[];
  initial: T;
  look?: ChoiceLook;
  searchable?: boolean;
}

interface ConfirmDeleteOptions {
  what: string;
  consequence: Text;
  confirmLabel?: Text;
}

interface DialogState {
  dialog: ConfirmDialogConfig | null;
  show: (config: ConfirmDialogConfig) => void;
  choose: (value: string) => void;
  dismiss: () => void;
}

export type { AlternateTone, ChoiceLook, ConfirmActionOptions, ConfirmBase, ConfirmBaseOptions, DialogChoiceInput, DialogFactInput, ConfirmAlternate, ConfirmChoiceOptions, ConfirmDeleteOptions, ConfirmDialogConfig, ConfirmSaveAnswer, ConfirmSaveOptions, DialogAlternate, DialogChoice, DialogFact, DialogState };
