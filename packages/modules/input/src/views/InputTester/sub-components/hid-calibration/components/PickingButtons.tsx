/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { PickingButtonsProps } from './ActionButtons.type';

const PickingButtons = ({ onConfirm, onCancel, confirmDisabled, children }: PickingButtonsProps) => (
  <>
    <Button variant="primary" size="sm" onClick={onConfirm} disabled={confirmDisabled}>
      {children}
    </Button>
    <Button variant="danger" size="sm" onClick={onCancel}>Cancel</Button>
  </>
);

export { PickingButtons };
