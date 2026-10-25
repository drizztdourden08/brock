/* @layer renderer-shell @kind component */
import { useCallback } from 'react';
import { Button } from '@drizztdourden08/tessera/primitives';
import { BackNextActions } from './BackNextActions';
import type { DiagnosticsStepActionsProps } from './diagnostics-steps.type';

const DiagnosticsStepActions = (props: DiagnosticsStepActionsProps) => {
  const { wizard, cancelAction, introBack, onByteCaptureNext, capturedCount } = props;
  const { confirmChoice } = wizard;
  const handleConfirm = useCallback(() => { void confirmChoice(); }, [confirmChoice]);

  if (wizard.step === 'intro') {
    return (
      <>
        {cancelAction}
        {introBack && <Button variant="secondary" onClick={introBack}>Back</Button>}
        <Button variant="primary" onClick={wizard.goNext} disabled={wizard.releaseStatus !== 'done'}>Next</Button>
      </>
    );
  }

  if (wizard.step === 'choose-controller') {
    const capturingLayout = wizard.layoutStage === 'starting' || wizard.layoutStage === 'fetching' || wizard.layoutStage === 'stopping';
    return (
      <BackNextActions
        cancelAction={cancelAction}
        onBack={wizard.goBack}
        onNext={handleConfirm}
        nextDisabled={wizard.deviceKey === null || capturingLayout}
      />
    );
  }

  if (wizard.step === 'byte-capture') {
    return (
      <BackNextActions cancelAction={cancelAction} onBack={wizard.goBack} onNext={onByteCaptureNext} nextDisabled={capturedCount === 0} />
    );
  }

  if (wizard.step === 'positional-capture') {
    const notRestored = wizard.restoreStatus !== 'done';
    return (
      <BackNextActions
        cancelAction={cancelAction}
        onBack={wizard.goBack}
        onNext={wizard.goNext}
        backDisabled={notRestored}
        nextDisabled={notRestored}
      />
    );
  }

  return null;
};

export { DiagnosticsStepActions };
