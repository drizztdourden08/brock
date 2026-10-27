/* @layer renderer-shell @kind logic */
import type { ConfirmDialogConfig } from './dialog.type';
import { OPTION_PREFIX } from './dialog-view.constants';
import type { DialogAnswerChoice, DialogView } from './dialog-view.type';

const ids = new WeakMap<() => void, number>();
const counter = { last: 0 };

const idOf = (dialog: ConfirmDialogConfig): number => {
  const known = ids.get(dialog.onConfirm);
  if (known !== undefined) return known;
  counter.last += 1;
  ids.set(dialog.onConfirm, counter.last);
  return counter.last;
};

const answerChoices = (dialog: ConfirmDialogConfig): DialogAnswerChoice[] => [
  ...(dialog.choices ?? []).map((option): DialogAnswerChoice => ({
    id: `${OPTION_PREFIX}${option.value}`,
    label: option.label,
    kind: 'option',
    ...(option.description === undefined ? {} : { description: option.description }),
  })),
  { id: 'confirm', label: dialog.confirmLabel ?? 'Confirm', kind: 'confirm' },
  ...(dialog.alternate ? [{ id: 'alternate', label: dialog.alternate.label, kind: 'alternate' } satisfies DialogAnswerChoice] : []),
  { id: 'cancel', label: dialog.cancelLabel ?? 'Cancel', kind: 'cancel' },
];

const dialogView = (dialog: ConfirmDialogConfig): DialogView => ({
  id: idOf(dialog),
  title: dialog.title,
  message: dialog.message,
  variant: dialog.variant ?? 'default',
  ...(dialog.choice === undefined ? {} : { selected: dialog.choice }),
  choices: answerChoices(dialog),
});

export { dialogView };
