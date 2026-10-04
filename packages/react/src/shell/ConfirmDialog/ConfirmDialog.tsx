/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { useDialogStore } from '../../stores/useDialogStore';
import { CancelFirstDialog } from './sub-components/CancelFirstDialog';

const noop = () => {};

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);

  if (!dialog) return <Dialog open={false} title="" message="" onConfirm={noop} onCancel={dismiss} />;
  if (dialog.focus === 'cancel') return <CancelFirstDialog dialog={dialog} onCancel={dismiss} />;
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
