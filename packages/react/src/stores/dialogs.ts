/* @layer renderer-shell @kind logic */
import type { ConfirmDialogConfig } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const dialogs = {
  show: (config: ConfirmDialogConfig): void => useDialogStore.getState().show(config),
  dismiss: (): void => useDialogStore.getState().dismiss(),
  confirmDelete: (title: string, message: string, onConfirm: () => void): void =>
    useDialogStore.getState().show({
      title,
      message,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => { useDialogStore.setState({ dialog: null }); onConfirm(); },
    }),
};

export { dialogs };
