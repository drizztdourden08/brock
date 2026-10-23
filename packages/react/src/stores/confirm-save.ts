/* @layer renderer-shell @kind logic */
import type { ConfirmSaveAnswer, ConfirmSaveOptions } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const confirmSave = ({ discardLabel = 'Discard', confirmLabel = 'Save', cancelLabel = 'Cancel', ...rest }: ConfirmSaveOptions): Promise<ConfirmSaveAnswer> =>
  new Promise((resolve) => {
    const answer = (value: ConfirmSaveAnswer) => () => {
      useDialogStore.setState({ dialog: null });
      resolve(value);
    };
    useDialogStore.getState().dismiss();
    useDialogStore.getState().show({
      ...rest,
      confirmLabel,
      cancelLabel,
      alternate: { label: discardLabel, onSelect: answer('discard') },
      onConfirm: answer('save'),
      onCancel: () => resolve('cancel'),
    });
  });

export { confirmSave };
