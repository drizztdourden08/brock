/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { INPUT_TESTER_SCREEN_ID } from './input-renderer.constants';
import { inputTesterScreen } from './InputTesterScreen';

const inputRenderer: RendererModule = {
  id: 'input',
  screens: [inputTesterScreen],
  menu: [{ key: INPUT_TESTER_SCREEN_ID, label: 'Controllers', icon: 'gamepad-2', section: 'advanced', screen: INPUT_TESTER_SCREEN_ID }],
};

export default inputRenderer;
export { inputRenderer, inputTesterScreen, INPUT_TESTER_SCREEN_ID };
export { inputApi } from './input-api';
export { InputTester } from './InputTester';
export { useControllerDevicesStore } from './useControllerDevicesStore';
export type { ControllerDevicesStore } from './controller-devices-store.type';
export { useControllerStateStore } from './useControllerStateStore';
export { useControllerState } from './useControllerState';
export type { ControllerLiveState, ControllerStateStore } from './controller-state-store.type';
export { useCalibrationStore } from './useCalibrationStore';
export type { CalibrationState } from './calibration-store.type';
export { SDL_BUTTON_NAMES, SDL_AXIS_NAMES, SDL_AXIS } from '../input.constants';
export { applyStickCalibration } from '../calibration/apply-stick-calibration';
export { applyTriggerCalibration } from '../calibration/apply-trigger-calibration';
export type { InputApi, InputCalibrationApi, InputCaptureApi, InputMappingApi } from '../input-api.type';
export type { DeviceEntry, InputStatus, VibrateSegment, VibrateResult } from '../device.type';
export type { DeviceStickCalibration, TriggerCalibration, StickPoint } from '../calibration.type';
