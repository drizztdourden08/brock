/* @layer renderer-shell @kind types */
import type { GamepadDiagnosticsReport } from '../../hid-calibration/diagnostics';
import type { HidControllerMap } from '../../HidCalibrationWizard';
import type { PositionalCaptureRecord } from '../../diagnostics-wizard/positional-capture/positional-capture.type';
import type { DetectionContext, ReportIdentity } from '../controller-report.type';

interface ReportRequestParams {
  subjectPrefix: string;
  identity: ReportIdentity | null;
  name: string;
  email: string;
  additionalInfo: string;
  detection: DetectionContext;
  debugText: string;
  calibrationMap: HidControllerMap | null;
  positionalRecords: readonly PositionalCaptureRecord[];
  diagnosticsReport: GamepadDiagnosticsReport | null;
}

export type { ReportRequestParams };
