/* @layer renderer-shell @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { PickingButtons } from './PickingButtons';
import { StartPickSkipButtons } from './StartPickSkipButtons';
import { StopButton } from './StopButton';
import type { TriggerCardActionsProps } from './TriggerCards.type';

const TriggerActionButtons = (props: TriggerCardActionsProps) => {
  const {
    state, triggerPickedByte, idleRecording, hasIdleResult, onConfirmTriggerPick, onCancelTriggerPick, onStopTrigger,
    onRedo, onStart, onPick, onSkip, onRecordIdle,
  } = props;
  const { item, isPicking, isRecording, isDone, otherBusy } = state;

  if (isPicking) {
    return (
      <PickingButtons onConfirm={onConfirmTriggerPick} onCancel={onCancelTriggerPick} confirmDisabled={triggerPickedByte === null}>
        Confirm
      </PickingButtons>
    );
  }

  if (isRecording) return <StopButton onStop={onStopTrigger} />;

  if (isDone) {
    return (
      <>
        <Button variant="tertiary" size="sm" onClick={onRedo} disabled={otherBusy}>Redo</Button>
        <Button
          variant="tertiary"
          size="sm"
          disabled={idleRecording !== null}
          className={hasIdleResult ? 'input-cal__btn--done' : ''}
          onClick={onRecordIdle}>
          {idleRecording === item.label ? 'Recording...' : <>{hasIdleResult && <Icon name="check" />} Idle</>}
        </Button>
      </>
    );
  }

  return <StartPickSkipButtons onStart={onStart} onPick={onPick} onSkip={onSkip} disabled={otherBusy} />;
};

export { TriggerActionButtons };
