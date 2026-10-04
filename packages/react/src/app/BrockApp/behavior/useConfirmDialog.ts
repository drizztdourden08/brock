/* @layer renderer-shell @kind hook */
import { dialogs } from '../../../stores/dialogs';
import { useDialogStore } from '../../../stores/useDialogStore';

const useConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const showDialog = useDialogStore((s) => s.show);
  const dismissDialog = useDialogStore((s) => s.dismiss);
  return { dialog, showDialog, dismissDialog, confirmDelete: dialogs.confirmDelete };
};

export { useConfirmDialog };
