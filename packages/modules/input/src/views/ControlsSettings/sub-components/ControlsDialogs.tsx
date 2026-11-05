/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Dialog } from '@drizztdourden08/tessera/composites';
import type { ControlsDialogsProps } from './ControlsDialogs.type';

const ControlsDialogs = ({ ctrl }: ControlsDialogsProps) => {
  const { labels, confirmPreset, deleteTarget, setConfirmPreset, setDeleteTarget } = ctrl;
  const cancelPreset = useCallback(() => setConfirmPreset(null), [setConfirmPreset]);
  const cancelDelete = useCallback(() => setDeleteTarget(null), [setDeleteTarget]);

  return (
    <>
      <Dialog
        open={Boolean(confirmPreset)}
        title={labels.presetTitle}
        message={labels.presetMessage(confirmPreset?.deviceName ?? '')}
        confirmLabel={labels.presetConfirm}
        cancelLabel={labels.cancel}
        onConfirm={ctrl.handleApplyPreset}
        onCancel={cancelPreset}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        title={labels.deleteTitle}
        message={labels.deleteMessage(deleteTarget?.name ?? '')}
        variant="danger"
        confirmLabel={labels.deleteConfirm}
        cancelLabel={labels.cancel}
        onConfirm={ctrl.handleDeleteConfirm}
        onCancel={cancelDelete}
      />
    </>
  );
};

export { ControlsDialogs };
