/* @layer renderer-shell @kind logic */
import { confirmAction } from './confirm-action';
import type { ConfirmDialogConfig } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const confirmDelete = (title: string, message: string, onConfirm: () => void): void => {
  void confirmAction({ title, message, confirmLabel: 'Delete', variant: 'danger', focus: 'cancel' }).then((confirmed) => { if (confirmed) onConfirm(); });
};

const dialogs = {
  show: (config: ConfirmDialogConfig): void => useDialogStore.getState().show(config),
  dismiss: (): void => useDialogStore.getState().dismiss(),
  confirmDelete,
};

export { dialogs };
