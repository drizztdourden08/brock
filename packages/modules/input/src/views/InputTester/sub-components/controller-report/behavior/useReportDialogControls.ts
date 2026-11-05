/* @layer renderer-shell @kind hook */
import { useCallback, useRef, useState } from 'react';
import type { HidWizardHandle } from '../../HidCalibrationWizard.type';
import { useSummaryExport } from '../../diagnostics-wizard/behavior/useSummaryExport';
import { useFlashStatus } from '../../hid-calibration/hooks/useFlashStatus';
import { DEFAULT_RECORD_LINK_LABEL } from '../controller-report.constants';
import type { UseReportDialogControlsParams } from '../report-dialog-controls.type';

const useReportDialogControls = (params: UseReportDialogControlsParams) => {
  const { form, onClose, recordLinkLabel = DEFAULT_RECORD_LINK_LABEL } = params;
  const wizardRef = useRef<HidWizardHandle>(null);
  const [capturedCount, setCapturedCount] = useState(0);
  const { handleCopyJson } = useSummaryExport(form.wizard.byteCapture, form.wizard.positionalRecords);
  const [copyStatus, flashCopy] = useFlashStatus();
  const filed = form.status === 'done' ? form.filed : null;
  const { reset, goToStep, wizard } = form;
  const { goNext } = wizard;

  const closeForm = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const openAndClose = useCallback((url: string) => {
    window.open(url, '_blank');
    closeForm();
  }, [closeForm]);

  const handleByteCaptureNext = useCallback(() => {
    wizardRef.current?.finish();
    goNext();
  }, [goNext]);

  const handleCopy = useCallback(() => handleCopyJson().then(flashCopy), [handleCopyJson, flashCopy]);
  const goAbout = useCallback(() => goToStep('about'), [goToStep]);
  const goUserInfo = useCallback(() => goToStep('user-info'), [goToStep]);
  const goDiagnostics = useCallback(() => goToStep('diagnostics'), [goToStep]);
  const recordUrl = filed?.recordUrl;
  const issueUrl = filed?.issueUrl;
  const openRecord = useCallback(() => { if (recordUrl) openAndClose(recordUrl); }, [openAndClose, recordUrl]);
  const openIssue = useCallback(() => { if (issueUrl) openAndClose(issueUrl); }, [openAndClose, issueUrl]);

  return {
    wizardRef, capturedCount, setCapturedCount, copyStatus, handleCopy, filed, recordLinkLabel,
    closeForm, handleByteCaptureNext, goAbout, goUserInfo, goDiagnostics, openRecord, openIssue,
  };
};

export { useReportDialogControls };
