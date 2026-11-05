/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { EMAIL_RE } from '../controller-report.constants';
import type { ControllerReportFormParams } from '../controller-report-form.type';
import type { FiledControllerReport, ReportStep, SubmitStatus } from '../controller-report.type';
import { buildReportRequest } from './build-report-request';
import { useDetectionContext } from './useDetectionContext';
import { useReportDiagnostics } from './useReportDiagnostics';
import { useReportFields } from './useReportFields';

const useControllerReportForm = (params: ControllerReportFormParams) => {
  const { deviceKey, identity, debugText, submit: submitReport, subjectPrefix = '' } = params;

  const [step, setStep] = useState<ReportStep>('about');
  const { email, setEmail, emailTouched, name, setName, additionalInfo, setAdditionalInfo, resetFields } = useReportFields();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [filed, setFiled] = useState<FiledControllerReport | null>(null);

  const detection = useDetectionContext(deviceKey);
  const diagnosticsOpen = step === 'diagnostics' || step === 'confirm';
  const { wizard, diagnosticsReport } = useReportDiagnostics(deviceKey, diagnosticsOpen);
  const calibrationMap = wizard.byteCapture;
  const positionalRecords = wizard.positionalRecords;

  const emailValid = EMAIL_RE.test(email);
  const identityReady = identity !== null || emailValid;
  const canLeaveUserInfo = identityReady;
  const canSubmit = identityReady && calibrationMap !== null && debugText !== null && status !== 'submitting';

  const goToStep = useCallback((to: ReportStep) => setStep(to), []);
  const finishDiagnostics = useCallback(() => setStep('confirm'), []);
  const backToDiagnostics = useCallback(() => setStep('diagnostics'), []);

  const submit = useCallback(async () => {
    if (!canSubmit || debugText === null) return;
    setStatus('submitting');
    try {
      const request = buildReportRequest({
        subjectPrefix, identity, name, email, additionalInfo, detection, debugText, calibrationMap, positionalRecords, diagnosticsReport,
      });
      const result = await submitReport(request);
      setFiled(result);
      setStatus(result ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }, [canSubmit, calibrationMap, diagnosticsReport, positionalRecords, debugText, identity, email, name, additionalInfo, detection, subjectPrefix, submitReport]);

  const reset = useCallback(() => {
    setStep('about');
    resetFields();
    setStatus('idle');
    setFiled(null);
    wizard.restart();
  }, [wizard, resetFields]);

  return {
    step, goToStep, finishDiagnostics, backToDiagnostics, wizard,
    identity, email, setEmail, emailTouched, emailValid, canLeaveUserInfo,
    name, setName, additionalInfo, setAdditionalInfo,
    detection, debugText, calibrationMap, diagnosticsReport,
    canSubmit, status, filed, submit, reset,
  };
};

export { useControllerReportForm };
