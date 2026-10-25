/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { BackNextActionsProps } from './diagnostics-steps.type';

const BackNextActions = ({ cancelAction, onBack, onNext, backDisabled, nextDisabled }: BackNextActionsProps) => (
  <>
    {cancelAction}
    <Button variant="secondary" onClick={onBack} disabled={backDisabled}>Back</Button>
    <Button variant="primary" onClick={onNext} disabled={nextDisabled}>Next</Button>
  </>
);

export { BackNextActions };
