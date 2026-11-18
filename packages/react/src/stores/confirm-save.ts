/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ConfirmSaveAnswer, ConfirmSaveOptions } from './dialog.type';
import { controlSources } from '../app/control-sources';
import { resolveDialogBase } from './resolve-dialog-base';
import { useDialogStore } from './useDialogStore';

const confirmSave = ({ discardLabel = msg('brock-shell:dialog.discard'), confirmLabel = msg('brock-shell:dialog.save'), cancelLabel = msg('brock-shell:dialog.cancel'), ...rest }: ConfirmSaveOptions): Promise<ConfirmSaveAnswer> =>
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
