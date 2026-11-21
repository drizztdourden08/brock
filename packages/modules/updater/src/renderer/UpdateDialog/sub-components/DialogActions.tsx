/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { Button } from '@drizztdourden08/tessera/primitives';
import type { DialogActionsProps } from '../UpdateDialog.type';
import { applyLabel } from '../behavior/apply-label';
import { isBusy } from '../behavior/is-busy';

const DialogActions = (props: DialogActionsProps) => {
  const {
    status, canCheck, canInstall, hasChoices, selected, isLatest, action, info, confirmRef, onApply, onOpenReleasePage, onClose,
  } = props;
  const text = useText();
  const busy = isBusy(status);
  const canAct = busy || status === 'available' || (status === 'idle' && hasChoices);

  return (
    <>
      <Button variant="tertiary" onClick={onClose}>{text(msg(canCheck ? 'updater:dialog.later' : 'updater:dialog.close'))}</Button>
      {canInstall && canAct && (
        <Button
          ref={confirmRef}
          variant="primary"
          disabled={busy || !selected}
          onClick={() => onApply(isLatest ? null : selected)}
        >
          {text(applyLabel(status, action))}
        </Button>
      )}
      {!canInstall && info && (
        <Button ref={confirmRef} variant="primary" onClick={() => onOpenReleasePage(info.version)}>
          {text(msg('updater:dialog.openReleasePage'))}
        </Button>
      )}
    </>
  );
};

export { DialogActions };
