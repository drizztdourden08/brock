/* @layer renderer-shell @kind constants */
import type { RawCaptureFailureReason } from '../../../../../capture.type';

const REASON_TEXT: Record<RawCaptureFailureReason, string> = {
  'unavailable-exclusive': 'Another application holds this controller.',
  'not-found': 'Not exposed to HID. Only positional can be captured.',
  error: 'The capture layer reported an error.',
};

export { REASON_TEXT };
