/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Flex, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import './ConfirmActions.css';
import type { ConfirmActionsProps } from './ConfirmActions.type';

const ConfirmActions = (props: ConfirmActionsProps) => {
  const { common } = useTesseraStrings();
  const { alternate, confirmLabel = common.confirm, cancelLabel = common.cancel, danger, confirmRef, cancelRef, onConfirm, onCancel } = props;
  const start = alternate && (
    <Flex gap="sm" align="center" className="confirm-actions__start">
      <Button variant={alternate.tone === 'neutral' ? 'secondary' : 'danger'} onClick={alternate.onSelect}>{alternate.label}</Button>
    </Flex>
  );
  return (
    <ButtonRow lead={start} className="confirm-actions">
      <Flex gap="sm" align="center" className="confirm-actions__end">
        <Button ref={cancelRef} variant="tertiary" onClick={onCancel}>{cancelLabel}</Button>
        <Button ref={confirmRef} variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
      </Flex>
    </ButtonRow>
  );
};

export { ConfirmActions };
