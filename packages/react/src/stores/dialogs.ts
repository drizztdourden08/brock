/* @layer renderer-shell @kind logic */
import { answerDialog } from './answer-dialog';
import { confirmAction } from './confirm-action';
import type { ConfirmDialogConfig } from './dialog.type';
import { dialogView } from './dialog-view';
import type { DialogView } from './dialog-view.type';
import { useDialogStore } from './useDialogStore';

const confirmDelete = (title: string, message: string, onConfirm: () => void): void => {
  void confirmAction({ title, message, confirmLabel: 'Delete', variant: 'danger' }).then((confirmed) => { if (confirmed) onConfirm(); });
};

const currentDialog = (): DialogView | null => {
  const { dialog } = useDialogStore.getState();
  return dialog === null ? null : dialogView(dialog);
};

const dialogs = {
  show: (config: ConfirmDialogConfig): void => useDialogStore.getState().show(config),
  dismiss: (): void => useDialogStore.getState().dismiss(),
  current: currentDialog,
  answer: answerDialog,
  confirmDelete,
};

export { dialogs };
