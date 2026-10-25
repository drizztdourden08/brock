/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { StartPickSkipButtonsProps } from './ActionButtons.type';

const StartPickSkipButtons = ({ onStart, onPick, onSkip, disabled }: StartPickSkipButtonsProps) => (
  <>
    <Button variant="primary" size="sm" onClick={onStart} disabled={disabled}>Start</Button>
    <Button variant="tertiary" size="sm" onClick={onPick} disabled={disabled}>Pick</Button>
    <Button variant="tertiary" size="sm" onClick={onSkip} disabled={disabled}>Skip</Button>
  </>
);

export { StartPickSkipButtons };
