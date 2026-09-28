/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { DialogActionsProps } from '../UpdateDialog.type';
import { applyLabel } from '../behavior/apply-label';
import { isBusy } from '../behavior/is-busy';

const DialogActions = (props: DialogActionsProps) => {
  const {
    status, canInstall, hasChoices, selected, isLatest, action, info, confirmRef, onApply, onOpenReleasePage, onClose,
  } = props;
  const busy = isBusy(status);
  const canAct = busy || status === 'available' || (status === 'idle' && hasChoices);

  return (
    <>
      <Button variant="tertiary" onClick={onClose}>Later</Button>
      {canInstall && canAct && (
        <Button
          ref={confirmRef}
          variant="primary"
          disabled={busy || !selected}
          onClick={() => onApply(isLatest ? null : selected)}
        >
          {applyLabel(status, action)}
        </Button>
      )}
      {!canInstall && info && (
        <Button ref={confirmRef} variant="primary" onClick={() => onOpenReleasePage(info.version)}>
          Open the release page
        </Button>
      )}
    </>
  );
};

export { DialogActions };
