/* @layer renderer-shell @kind logic */
import type { ConfirmSaveAnswer, ConfirmSaveOptions } from './dialog.type';
import { controlSources } from '../app/control-sources';
import { resolveDialogBase } from './resolve-dialog-base';
import { useDialogStore } from './useDialogStore';

const confirmSave = ({ discardLabel = 'Discard', confirmLabel = 'Save', cancelLabel = 'Cancel', ...rest }: ConfirmSaveOptions): Promise<ConfirmSaveAnswer> =>
  new Promise((resolve) => {
    const answer = (value: ConfirmSaveAnswer) => () => {
      useDialogStore.setState({ dialog: null });
      resolve(value);
    };
    useDialogStore.getState().dismiss();
    useDialogStore.getState().show({
      ...resolveDialogBase({ ...rest, confirmLabel, cancelLabel }),
      alternate: { label: controlSources.get().text(discardLabel), onSelect: answer('discard'), tone: 'danger' },
      onConfirm: answer('save'),
      onCancel: () => resolve('cancel'),
    });
  });

export { confirmSave };
