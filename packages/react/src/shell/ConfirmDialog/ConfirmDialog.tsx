/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { useDialogStore } from '../../stores/useDialogStore';
import { CancelFirstDialog } from './sub-components/CancelFirstDialog';

const noop = () => {};

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);

  if (dialog?.focus === 'cancel') return <CancelFirstDialog dialog={dialog} onCancel={dismiss} />;
  return (
    <Dialog
      open={dialog !== null}
      title={dialog?.title ?? ''}
      message={dialog?.message ?? ''}
      confirmLabel={dialog?.confirmLabel}
      cancelLabel={dialog?.cancelLabel}
      variant={dialog?.variant}
      onConfirm={dialog?.onConfirm ?? noop}
      onCancel={dismiss}
    />
  );
};

export { ConfirmDialog };
