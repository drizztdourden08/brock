/* @layer renderer-shell @kind component */
import { useCallback, useRef, useState } from 'react';
import { Wizard } from '@drizztdourden08/tessera/composites';
import { Box } from '@drizztdourden08/tessera/primitives';
import type { HidWizardHandle } from '../HidCalibrationWizard';
import { diagnosticsRunResultOf } from './behavior/diagnostics-run-result-of';
import { useDiagnosticsWizardApi } from './behavior/useDiagnosticsWizardApi';
import { useDiagnosticsWizardState } from './behavior/useDiagnosticsWizardState';
import { useSummaryHandlers } from './behavior/useSummaryHandlers';
import { DEFAULT_FINISH, RESTART_LABEL, RESTART_SAME_LABEL } from './diagnostics-wizard.constants';
import { DiagnosticsFlowBody } from './DiagnosticsFlowBody';
import { SummaryActions } from './sub-components/SummaryActions';
import type { DiagnosticsWizardProps } from './DiagnosticsWizard.type';
import './DiagnosticsWizard.css';

const DiagnosticsWizard = (props: DiagnosticsWizardProps) => {
  const { onClose, onComplete, initialDeviceKey, preselected = false, onReport, reportLook = DEFAULT_FINISH } = props;
  const wizard = useDiagnosticsWizardState({ open: true, onComplete, initialDeviceKey, preselected });
  const wizardRef = useRef<HidWizardHandle>(null);
  const [capturedCount, setCapturedCount] = useState(0);
  const summary = useSummaryHandlers(wizard);
  const { finishAndClose, goNext, restart } = wizard;

  const handleClose = useCallback(() => finishAndClose(onClose), [finishAndClose, onClose]);
  const handleFinish = useCallback(() => {
    const result = diagnosticsRunResultOf(wizard);
    if (onReport && result) onReport(result);
    handleClose();
  }, [wizard, onReport, handleClose]);
  const handleByteCaptureNext = useCallback(() => {
    wizardRef.current?.finish();
    goNext();
  }, [goNext]);

  const api = useDiagnosticsWizardApi({
    wizard,
    capturedCount,
    finishLook: reportLook,
    onByteCaptureNext: handleByteCaptureNext,
    onFinish: handleFinish,
    summaryActions: (
      <SummaryActions
        restartLabel={preselected ? RESTART_SAME_LABEL : RESTART_LABEL}
        onRestart={restart}
        saveStatus={summary.saveStatus}
        onSave={summary.handleSave}
        copyStatus={summary.copyStatus}
        onCopy={summary.handleCopy}
      />
    ),
  });

  return (
    <Box className="diagnostics-wizard">
      <Wizard wizard={api} onExit={handleClose}>
        <DiagnosticsFlowBody wizard={wizard} wizardRef={wizardRef} onCapturedCountChange={setCapturedCount} />
      </Wizard>
    </Box>
  );
};

export { DiagnosticsWizard };
