/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { DialogShell, FactsPanel } from '@drizztdourden08/tessera/composites';
import { Paragraph } from '@drizztdourden08/tessera/primitives';
import { useDialogStore } from '../../stores/useDialogStore';
import './ConfirmDialog.css';
import { ConfirmActions } from './sub-components/ConfirmActions';
import { ConfirmChoices } from './sub-components/ConfirmChoices';

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);
  const choose = useDialogStore((s) => s.choose);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!dialog) return null;
  const { choices, choice, alternate, facts } = dialog;
  const danger = dialog.variant === 'danger';
  return (
    <DialogShell
      open
      title={dialog.title}
      onClose={dismiss}
      initialFocusRef={danger ? cancelRef : confirmRef}
      initialFocus={danger ? 'dialog' : 'first'}
      actions={(
        <ConfirmActions
          alternate={alternate}
          confirmLabel={dialog.confirmLabel}
          cancelLabel={dialog.cancelLabel}
          danger={danger}
          confirmRef={confirmRef}
          cancelRef={cancelRef}
          onConfirm={dialog.onConfirm}
          onCancel={dismiss}
        />
      )}
    >
      {dialog.message && <Paragraph tone="dim" className="confirm-dialog__message">{dialog.message}</Paragraph>}
      {facts && facts.length > 0 && <FactsPanel groups={[facts]} layout="rows" label={dialog.title} />}
      {choices && choices.length > 0 && (
        <ConfirmChoices choices={choices} value={choice} label={dialog.title} look={dialog.look} searchable={dialog.searchable} onChange={choose} />
      )}
    </DialogShell>
  );
};

export { ConfirmDialog };
