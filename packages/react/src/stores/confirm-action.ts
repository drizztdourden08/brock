/* @layer renderer-shell @kind logic */
import type { ConfirmActionOptions } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const confirmAction = (options: ConfirmActionOptions): Promise<boolean> =>
  new Promise((resolve) => {
    useDialogStore.getState().dismiss();
    useDialogStore.getState().show({
      ...options,
      onConfirm: () => {
        useDialogStore.setState({ dialog: null });
        resolve(true);
      },
      onCancel: () => resolve(false),
    });
  });

export { confirmAction };
