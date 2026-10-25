/* @layer renderer-shell @kind types */
import type { DiagnosticsRunResult } from '../../renderer/diagnostics-run-result.type';
import type { FinishLook } from '../InputTester/sub-components/diagnostics-wizard/diagnostics-wizard.type';

interface ControllerDiagnosticsProps {
  initialDeviceKey?: string | null;
}

interface ReportHandoff {
  look: FinishLook;
  send: (result: DiagnosticsRunResult) => void;
}

export type { ControllerDiagnosticsProps, ReportHandoff };
