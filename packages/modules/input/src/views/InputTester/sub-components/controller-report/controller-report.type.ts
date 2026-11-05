/* @layer renderer-shell @kind types */
type ReportStep = 'about' | 'user-info' | 'diagnostics' | 'confirm';

type SubmitStatus = 'idle' | 'submitting' | 'done' | 'error';

interface FiledControllerReport {
  reportId: string;
  issueUrl: string;
  recordUrl?: string;
}

interface DetectionContext {
  detectedName: string;
  sdlMatch: string | null;
  inputApi: string;
  vendorId: string;
  productId: string;
  hidReport: string;
}

interface ReportIdentity {
  displayName: string;
  githubHandle: string | null;
}

interface ControllerReportPayload {
  detectedName: string;
  sdlMatch: string | null;
  inputApi: string;
  vendorId: string;
  productId: string;
  hidReport: string;
  calibrationMap: string;
  positionalCapture?: string;
  diagnosticsReport?: string;
}

interface ControllerReportSubmission {
  subject: string;
  description: string;
  debugInfo: string;
  contactEmail: string | null;
  controllerReport: ControllerReportPayload;
}

interface ReportSectionProps {
  label: string;
  text: string;
}

interface StepIndicatorProps {
  labels: readonly string[];
  current: number;
}

export type {
  ControllerReportPayload, ControllerReportSubmission, DetectionContext, FiledControllerReport, ReportIdentity,
  ReportSectionProps, ReportStep, StepIndicatorProps, SubmitStatus,
};
