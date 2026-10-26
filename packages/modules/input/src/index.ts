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
export type { MappingEntry, MappingSource } from './mapping/mapping-entry.type';
export { parseMapping } from './mapping/parse-mapping';
export { parseMappings } from './mapping/parse-mappings';
export { decodeGuid } from './mapping/decode-guid';
export type { InputMappingApi, InputCalibrationApi, InputCaptureApi, InputApi } from './input-api.type';
export { noopInputApi } from './noop-input-api';
export type { SdlButtonName } from './pad/sdl-button-name.type';
export type { SdlAxisName, SdlGamepadType } from './sdl/sdl-buttons.type';
export type { DeviceFamily, DeviceInputApi } from './sdl/device-family.type';
export type { VibrationSegment } from './vibration-segment.type';
export {
  BUTTON_INDEX, GAMECUBE_FAMILY, GENERIC_FAMILY, NINTENDO_FAMILY, PLAYSTATION_FAMILY, XBOX_FAMILY, applyVibrationShaping,
  buildDisplayContext, resolveAxisLabel, resolveBrandLogoKey, resolveButtonIcon, resolveButtonLabel, resolveDeviceControls,
  resolveDeviceName, resolveStickDirectionIcon, resolveTriggerPressThreshold,
} from './family';
export type { DisplayContext, FamilyMetadata, ResolvedControl, ResolvedDevice } from './family';
export { resolveShapeVibration } from './family/resolve-display/resolve-shape-vibration';
export { resolveLiveControlState } from './family/live-control-state';
export type { LiveControlState } from './family/live-control-state.type';
export { buildDeviceProfile, buildDeviceProfileFromResolved, buildDeviceProfileFromSdlType } from './device-profile';
export type { DeviceProfile, DeviceProfileAxis, DeviceProfileButton, DeviceProfileIdentity } from './device-profile';
export { resolveDeviceFromEntry } from './runtime/resolve-device';
export { recallControllerSdlType } from './runtime/controller-family-cache';
