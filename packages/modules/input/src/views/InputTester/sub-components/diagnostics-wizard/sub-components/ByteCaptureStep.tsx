/* @layer renderer-shell @kind component */
import { forwardRef } from 'react';
import { HidCalibrationWizard } from '../../HidCalibrationWizard';
import type { HidWizardHandle } from '../../HidCalibrationWizard';
import type { ByteCaptureStepProps } from './diagnostics-steps.type';
import { HoldStatusLine } from './HoldStatusLine';

const ByteCaptureStep = forwardRef<HidWizardHandle, ByteCaptureStepProps>((props, ref) => {
  const { releaseStatus, deviceKey, initialProfile, capturedEntry, initialProfileId, initialHasGyro, onCapturedCountChange, onComplete, onCancel } = props;

  return (
    <>
      <HoldStatusLine
        status={releaseStatus}
        pendingText="Pausing your controller in the app..."
        doneText="Your controller is paused in the app while the capture runs."
        errorText="Could not pause your controller. The capture may stay empty."
      />
      {releaseStatus === 'done' && (
        <HidCalibrationWizard
          ref={ref}
          deviceKey={deviceKey ?? undefined}
          initialProfile={initialProfile}
          capturedEntry={capturedEntry}
          initialProfileId={initialProfileId}
          initialHasGyro={initialHasGyro}
          hideOwnActions
          onCapturedCountChange={onCapturedCountChange}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      )}
    </>
  );
});

ByteCaptureStep.displayName = 'ByteCaptureStep';

export { ByteCaptureStep };
