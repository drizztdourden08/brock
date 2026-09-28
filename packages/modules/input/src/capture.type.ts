/* @layer core @kind types */
type RawCaptureFailureReason = 'not-found' | 'unavailable-exclusive' | 'error';

interface RawCaptureStartResult {
  ok: boolean;
  reason?: RawCaptureFailureReason;
  message?: string;
}

interface ControllerRawReport {
  vendorId: number;
  productId: number;
  reportId: number;
  bytes: number[];
}

interface ControllerJoystickSample {
  id: number;
  buttons: boolean[];
  axes: number[];
  hats: number[];
}

interface JoystickInfo {
  id: number;
  name: string;
  guid: string;
  numButtons: number;
  numAxes: number;
  numHats: number;
  hasGamepadMapping: boolean;
}

export type { RawCaptureFailureReason, RawCaptureStartResult, ControllerRawReport, ControllerJoystickSample, JoystickInfo };
