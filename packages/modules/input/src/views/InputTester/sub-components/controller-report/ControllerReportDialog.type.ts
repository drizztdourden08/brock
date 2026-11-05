/* @layer renderer-shell @kind types */
import type { ControllerReportSubmission, FiledControllerReport, ReportIdentity } from './controller-report.type';

interface ControllerReportDialogProps {
  open: boolean;
  onClose: () => void;
  deviceKey: string;
  identity: ReportIdentity | null;
  debugText: string | null;
  submit: (submission: ControllerReportSubmission) => Promise<FiledControllerReport | null>;
  subjectPrefix?: string;
  recordLinkLabel?: string;
}

export type { ControllerReportDialogProps };
