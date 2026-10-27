/* @layer renderer-shell @kind logic */
import type { ConfirmDialogConfig } from './dialog.type';
import { dialogView } from './dialog-view';
import { OPTION_PREFIX } from './dialog-view.constants';
import type { DialogAnswerKind, DialogAnswerResult } from './dialog-view.type';
import { useDialogStore } from './useDialogStore';

const perform = (dialog: ConfirmDialogConfig, kind: DialogAnswerKind, id: string): void => {
  const store = useDialogStore.getState();
  if (kind === 'cancel') store.dismiss();
  else if (kind === 'alternate') dialog.alternate?.onSelect();
  else {
    if (kind === 'option') store.choose(id.slice(OPTION_PREFIX.length));
    dialog.onConfirm();
  }
};

const answerDialog = (choice: string): DialogAnswerResult => {
  const dialog = useDialogStore.getState().dialog;
  if (dialog === null) return { ok: false, why: 'none', reason: 'No confirm dialog is open.' };
  const view = dialogView(dialog);
  const picked = view.choices.find((entry) => entry.id === choice);
  if (picked === undefined) return { ok: false, why: 'unknown', reason: `"${choice}" is not one of: ${view.choices.map((entry) => entry.id).join(', ')}.` };
  perform(dialog, picked.kind, picked.id);
  return { ok: true, id: view.id, choice: picked.id };
};

export { answerDialog };
