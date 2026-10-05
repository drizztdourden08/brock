/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { RadioGroup } from '@drizztdourden08/tessera/primitives';
import { useDialogStore } from '../../stores/useDialogStore';

const noop = () => {};

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);
  const choose = useDialogStore((s) => s.choose);

  if (!dialog) return <Dialog open={false} title="" message="" onConfirm={noop} onCancel={dismiss} />;
  const { choices, choice } = dialog;
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
    >
      {choices && choices.length > 0 && (
        <RadioGroup value={choice ?? choices[0]?.value ?? ''} options={[...choices]} onChange={choose} label={dialog.title} direction="vertical" />
      )}
    </Dialog>
  );
};

export { ConfirmDialog };
