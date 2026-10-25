/* @layer renderer-shell @kind types */
import type { DeviceEntry } from '../device.type';
import type { HidControllerMap } from '../views/InputTester/sub-components/HidCalibrationWizard';
import type { PositionalCaptureRecord } from '../views/InputTester/sub-components/diagnostics-wizard/positional-capture/positional-capture.type';

interface DiagnosticsRunResult {
  deviceKey: string;
  entry: DeviceEntry | null;
  mapping: string | null;
  byteCapture: HidControllerMap | null;
  positionalRecords: PositionalCaptureRecord[];
}

export type { DiagnosticsRunResult };
