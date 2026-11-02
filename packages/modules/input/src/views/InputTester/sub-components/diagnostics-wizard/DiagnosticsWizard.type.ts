/* @layer renderer-shell @kind types */
import type { DiagnosticsRunResult } from '../../../../renderer/diagnostics-run-result.type';
import type { HidControllerMap } from '../HidCalibrationWizard';
import type { FinishLook } from './diagnostics-wizard.type';

interface DiagnosticsWizardProps {
  onClose: () => void;
  onComplete?: (map: HidControllerMap) => void;
  initialDeviceKey?: string | null;
  preselected?: boolean;
  onReport?: (result: DiagnosticsRunResult) => void;
  reportLook?: FinishLook;
}

export type { DiagnosticsWizardProps };
