/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { PickingButtons } from './PickingButtons';
import { StartPickSkipButtons } from './StartPickSkipButtons';
import { StopButton } from './StopButton';
import type { StickCardActionsProps } from './StickCards.type';

const StickActionButtons = (props: StickCardActionsProps) => {
  const { state, pickedCount, onConfirmPick, onCancelPick, onStopCircle, onReadIdle, onRedo, onStart, onPick, onSkip } = props;
  const { isPicking, isRecording, needsIdle, isDone, otherBusy } = state;

  if (isPicking) {
    return (
      <PickingButtons onConfirm={onConfirmPick} onCancel={onCancelPick} confirmDisabled={pickedCount === 0}>
        Confirm ({pickedCount})
      </PickingButtons>
    );
  }

  if (isRecording) return <StopButton onStop={onStopCircle} />;

  if (needsIdle) {
    return (
      <>
        <Button variant="primary" size="sm" onClick={onReadIdle} disabled={otherBusy}>
          Read idle position
        </Button>
        <Button variant="tertiary" size="sm" onClick={onRedo} disabled={otherBusy}>Redo</Button>
      </>
    );
  }

  if (isDone) return <Button variant="tertiary" size="sm" onClick={onRedo} disabled={otherBusy}>Redo</Button>;

  return <StartPickSkipButtons onStart={onStart} onPick={onPick} onSkip={onSkip} disabled={otherBusy} />;
};

export { StickActionButtons };
