/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Button, Paragraph, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import type { CancelFirstDialogProps } from './CancelFirstDialog.type';

const CancelFirstDialog = (props: CancelFirstDialogProps) => {
  const { dialog, onCancel } = props;
  const { common } = useTesseraStrings();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const actions = (
    <>
      <Button ref={cancelRef} variant="tertiary" onClick={onCancel}>{dialog.cancelLabel ?? common.cancel}</Button>
      <Button variant={dialog.variant === 'danger' ? 'danger' : 'primary'} onClick={dialog.onConfirm}>{dialog.confirmLabel ?? common.confirm}</Button>
    </>
  );
  return (
    <DialogShell open onClose={onCancel} title={dialog.title} actions={actions} initialFocusRef={cancelRef}>
      {dialog.message && <Paragraph tone="dim">{dialog.message}</Paragraph>}
    </DialogShell>
  );
};

export { CancelFirstDialog };
