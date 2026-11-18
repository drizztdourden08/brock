/* @layer renderer-shell @kind logic */
import { bindAlternate } from './confirm-alternate';
import type { ConfirmActionOptions } from './dialog.type';
import { resolveDialogBase } from './resolve-dialog-base';
import { useDialogStore } from './useDialogStore';

const confirmAction = (options: ConfirmActionOptions): Promise<boolean> =>
  new Promise((resolve) => {
    useDialogStore.getState().dismiss();
    const { alternate, ...base } = options;
    useDialogStore.getState().show({
      ...resolveDialogBase(base),
      alternate: bindAlternate(alternate, () => resolve(false)),
      onConfirm: () => {
        useDialogStore.setState({ dialog: null });
        resolve(true);
      },
      onCancel: () => resolve(false),
    });
  });

export { confirmAction };
