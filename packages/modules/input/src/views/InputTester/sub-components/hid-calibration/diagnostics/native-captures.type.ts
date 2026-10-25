/* @layer renderer-shell @kind types */
import type { JoystickInfo } from '../../../../../capture.type';

interface NativeCaptureStatus {
  rawAvailable: boolean;
  rawUnavailableReason: string | null;
  mappingString: string | null;
  joystickCounts: JoystickInfo | null;
}

export type { NativeCaptureStatus };
