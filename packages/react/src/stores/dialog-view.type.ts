/* @layer renderer-shell @kind types */
type DialogAnswerKind = 'confirm' | 'cancel' | 'alternate' | 'option';

interface DialogAnswerChoice {
  id: string;
  label: string;
  kind: DialogAnswerKind;
  description?: string;
}

interface DialogView {
  id: number;
  title: string;
  message: string;
  variant: 'danger' | 'default';
  selected?: string;
  choices: DialogAnswerChoice[];
}

type DialogAnswerFailure = 'none' | 'unknown';

type DialogAnswerResult = { ok: true; id: number; choice: string } | { ok: false; why: DialogAnswerFailure; reason: string };

export type { DialogAnswerChoice, DialogAnswerFailure, DialogAnswerKind, DialogAnswerResult, DialogView };
