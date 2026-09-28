/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { useDialogStore } from '../../stores/useDialogStore';

const noop = () => {};

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);

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
