/* @layer core @kind barrel */
import './augment';

export { SDL_BUTTON_NAMES, SDL_AXIS_NAMES, SDL_AXIS } from './input.constants';
export { padFamilyOf } from './pad/pad-family-of';
export { padStateOf } from './pad/pad-state-of';
export type {
  ControllerSlotId, ControllerSlotState, PadSlotState, PadSlots, PadExtra, PadState, PadFamily, PadDevice, PadStateListener,
} from './pad/controller-slot.type';
export { applyStickCalibration } from './calibration/apply-stick-calibration';
export { applyTriggerCalibration } from './calibration/apply-trigger-calibration';
export {
  DEFAULT_INNER_DEADZONE, DEFAULT_OUTER_DEADZONE, DEFAULT_TRIGGER_DEADZONE, IDENTITY_STICK,
} from './calibration/calibration.constants';
export type {
  ControllerBusType, ControllerConnectionState, ControllerGamepadType, DeviceStatus, ControllerAddedInfo,
  HidListedDevice, DeviceEntry, InputStatus, VibrateSegment, VibrateResult, ControllerStateListener,
} from './device.type';
export type {
  RawCaptureFailureReason, RawCaptureStartResult, ControllerRawReport, ControllerJoystickSample, JoystickInfo,
} from './capture.type';
export type {
  StickCalibration, DeviceStickCalibration, TriggerCalibration, StickCalibrationStore, TriggerCalibrationStore,
  StickPoint, StickSide,
} from './calibration.type';
export type { MappingEntry } from './mapping/mapping-entry.type';
export { parseMapping } from './mapping/parse-mapping';
export { parseMappings } from './mapping/parse-mappings';
export { decodeGuid } from './mapping/decode-guid';
export type { InputMappingApi, InputCalibrationApi, InputCaptureApi, InputApi } from './input-api.type';
export { noopInputApi } from './noop-input-api';
