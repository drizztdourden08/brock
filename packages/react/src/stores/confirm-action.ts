/* @layer renderer-shell @kind logic */
import { bindAlternate } from './confirm-alternate';
import type { ConfirmActionOptions } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const confirmAction = (options: ConfirmActionOptions): Promise<boolean> =>
  new Promise((resolve) => {
    useDialogStore.getState().dismiss();
    useDialogStore.getState().show({
      ...options,
      alternate: bindAlternate(options.alternate, () => resolve(false)),
      onConfirm: () => {
        useDialogStore.setState({ dialog: null });
        resolve(true);
      },
      onCancel: () => resolve(false),
    });
  });

export { confirmAction };
