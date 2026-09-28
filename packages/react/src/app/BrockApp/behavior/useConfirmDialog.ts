/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useDialogStore } from '../../../stores/useDialogStore';

const useConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const showDialog = useDialogStore((s) => s.show);
  const dismissDialog = useDialogStore((s) => s.dismiss);

  const confirmDelete = useCallback((title: string, message: string, onConfirm: () => void) => {
    showDialog({
      title,
      message,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => { useDialogStore.setState({ dialog: null }); onConfirm(); },
    });
  }, [showDialog]);

  return { dialog, showDialog, dismissDialog, confirmDelete };
};

export { useConfirmDialog };
