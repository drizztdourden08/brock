/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { useDialogStore } from '../../stores/useDialogStore';

const noop = () => {};

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);

  if (!dialog) return <Dialog open={false} title="" message="" onConfirm={noop} onCancel={dismiss} />;
  return (
    <Dialog
      open
      title={dialog.title}
      message={dialog.message}
      confirmLabel={dialog.confirmLabel}
      cancelLabel={dialog.cancelLabel}
      variant={dialog.variant}
      onConfirm={dialog.onConfirm}
      onCancel={dismiss}
    />
  );
};

export { ConfirmDialog };
