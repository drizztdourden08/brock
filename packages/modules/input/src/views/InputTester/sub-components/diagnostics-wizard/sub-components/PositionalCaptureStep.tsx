/* @layer renderer-shell @kind component */
import { useEffect } from 'react';
import { Box, Checkbox, Text } from '@drizztdourden08/tessera/primitives';
import { ButtonMappingActions } from '../../hid-calibration/components/ButtonMappingActions';
import { usePositionalOneByOne } from '../positional-capture/usePositionalOneByOne';
import type { PositionalCaptureStepProps } from './diagnostics-steps.type';
import { HoldStatusLine } from './HoldStatusLine';
import { PositionalCaptureCall } from './PositionalCaptureCall';
import { PositionalCaptureGrid } from './PositionalCaptureGrid';

const PositionalCaptureStep = (props: PositionalCaptureStepProps) => {
  const { restoreStatus, deviceKey, resolvedDevice, autoCapture, onAutoCaptureChange, onRecordsChange } = props;
  const active = restoreStatus === 'done';
  const capture = usePositionalOneByOne({ deviceKey, active, resolvedDevice, autoCapture, onAutoCaptureChange });
  const current = capture.inputPhaseActive ? capture.items[capture.activeIndex] ?? null : null;

  useEffect(() => { onRecordsChange(capture.records); }, [capture.records, onRecordsChange]);

  return (
    <>
      <HoldStatusLine
        status={restoreStatus}
        pendingText="Restoring the hold on every controller..."
        doneText="The hold is back. This controller reads normally again."
        errorText="Couldn't restore the hold. The capture below may not receive anything."
      />

      {active && deviceKey === null && (
        <Text as="p" className="diagnostics-wizard__pos-warning">
          No device selected for this capture. Go back and pick one.
        </Text>
      )}

      {active && deviceKey !== null && (
        <Box className="pos-step">
          <Text as="p">
            Each input below is asked for by name, one at a time, using the controller's own
            labels. Provide it on the controller and this records which physical position
            fired.
          </Text>
          <Checkbox label="Auto-capture" checked={capture.autoCapture} onChange={capture.onAutoCaptureToggle} />
          <PositionalCaptureCall
            call={{
              current,
              instruction: capture.instruction,
              answered: capture.capturedCount,
              total: capture.items.length,
              paused: !capture.inputPhaseActive,
            }}
          />
          <PositionalCaptureGrid
            items={capture.items}
            activeIndex={capture.activeIndex}
            inputPhaseActive={capture.inputPhaseActive}
            onSelect={capture.onClickItem}
            onClear={capture.onClearItem}
          />
          <Box className="pos-actions">
            <ButtonMappingActions
              activeIndex={capture.activeIndex}
              inputPhaseActive={capture.inputPhaseActive}
              autoAdvance={capture.autoAdvance}
              onStartButtons={capture.onStartButtons}
              onSkip={capture.onSkip}
              onGoBack={capture.onGoBack}
              setAutoAdvanceWrapped={capture.setAutoAdvanceWrapped}
              setInputPhaseActiveWrapped={capture.setInputPhaseActiveWrapped}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export { PositionalCaptureStep };
